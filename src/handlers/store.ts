import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";
import { hash } from "../lib/hash";
import { STORE_DIR } from "../lib/env";
import { mkdir } from "node:fs/promises";

const MetadataSchema = z.object({
  username: z.string(),
  folder: z.string().optional(),
});

export const storeHandler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const formData = await req.formData();
  const data = formData.get("data");
  const metadataFormData = formData.get("metadata");

  // TODO validate with zod?
  if (!data) return new Response("Bad Request", { status: 400 });
  if (!metadataFormData) return new Response("Bad Request", { status: 400 });
  if (typeof metadataFormData !== "string")
    return new Response("Bad Request", { status: 400 });
  if (!(data instanceof File))
    return new Response("Bad Request", { status: 400 });
  const parsed = MetadataSchema.safeParse(JSON.parse(metadataFormData));

  if (!parsed.success) {
    return new Response(
      parsed.error.issues.map((i) => `${i.path}: ${i.message}`).join("\n"),
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await data.arrayBuffer());

  const metadata = parsed.data;

  // infer file type from the data
  const fileType = await fileTypeFromBuffer(buffer);
  const fileHash = hash(buffer);

  // if file already exists, return the hash
  // this would include reading the metadata.json file data.ext file

  let path = `${STORE_DIR}/${metadata.username}/${fileHash}`;
  if (metadata.folder) {
    path = `${STORE_DIR}/${metadata.username}/${metadata.folder}/${fileHash}`;
  }

  await mkdir(path, { recursive: true });

  // TODO probably need error handling here
  await Bun.write(`${path}/data.${fileType?.ext}`, buffer);
  await Bun.write(`${path}/metadata.json`, JSON.stringify(metadata));

  return new Response(JSON.stringify({ hash: fileHash }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
