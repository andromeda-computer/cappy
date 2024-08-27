import { hash } from "../lib/hash";
import { mkdir } from "node:fs/promises";
import { RequestMetadataSchema, type DatabaseMetadata } from "../lib/types";
import { fileExists, hashExists, insertFile } from "../lib/db";
import { getFilePath, getFileType, writeFileMetadata } from "../lib/utils";

export const storeHandler = async (req: Request): Promise<Response> => {
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

  const parsed = RequestMetadataSchema.safeParse(JSON.parse(metadataFormData));

  if (!parsed.success) {
    return new Response(
      parsed.error.issues.map((i) => `${i.path}: ${i.message}`).join("\n"),
      { status: 400 }
    );
  }

  const originalFilename = data.name;
  const createdAt = Math.floor(Date.now() / 1000);
  const filename = parsed.data.filename ?? originalFilename;
  const buffer = Buffer.from(await data.arrayBuffer());
  const reqData = parsed.data;

  // infer file type from the data
  const fileType = await getFileType(data, buffer);
  const fileHash = hash(buffer);

  let metadata: DatabaseMetadata = {
    hash: fileHash,
    filename: reqData.filename ?? originalFilename,
    originalFilename,
    username: reqData.username,
    visibility: reqData.visibility,
    extension: fileType.ext,
    createdAt,
  };

  // check db if username/filename already exists
  const filenameExists = fileExists(reqData.username, filename);
  const hashExist = hashExists(reqData.username, fileHash);

  console.log(filenameExists, hashExist);

  if (!filenameExists && !hashExist) {
    // if new file, insert into db
    insertFile(metadata);
  } else {
    if (filenameExists && filenameExists.hash === fileHash) {
      // if the hash matches, return 200
      return new Response(
        JSON.stringify({ ...filenameExists, status: "exists" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (hashExist) {
      // if the hash exists, return 409
      return new Response("Different filename exists with the same hash.", {
        status: 409,
      });
    }

    // TODO built consitent error handling
    // if the hash does not match, return 409
    return new Response("File with this filename already exists.", {
      status: 409,
    });
  }

  let path = getFilePath(reqData.username, fileHash);
  await mkdir(path, { recursive: true });

  // TODO probably need error handling here
  await Bun.write(`${path}/data.${fileType.ext}`, buffer);
  await writeFileMetadata(metadata);

  return new Response(JSON.stringify({ ...metadata, status: "new" }), {
    status: 201, // created
    headers: { "Content-Type": "application/json" },
  });
};
