import { getFile } from "../../lib/db";
import { STORE_DIR } from "../../lib/env";
import type { GetFileRequestURLParams } from "../../lib/types";

const urlRegex = /^\/([^\/]+)\/([^\/]+)$/;

export function parseGetFileRequest(
  url: string
): GetFileRequestURLParams | null {
  const match = url.match(urlRegex);
  if (!match) return null;

  const [, username, filename] = match;
  const isHash = /^[a-fA-F0-9]{64}$/.test(filename);

  return { username, filename, isHash };
}

function parseRange(req: Request): [number, number] {
  const rangeHeader = req.headers.get("Range");
  if (!rangeHeader) {
    return [0, Infinity];
  }

  const parts = rangeHeader.split("=").at(-1)?.split("-") ?? [];
  const [startStr, endStr] = parts;

  const start = Number(startStr) || 0;
  const end = endStr ? Number(endStr) : Infinity;

  return [start, end];
}

export const getFileHandler = async (
  req: Request,
  params: GetFileRequestURLParams
): Promise<Response> => {
  const dbFile = getFile(params);

  // if file not found
  if (!dbFile) return new Response("File not found", { status: 404 });

  // if file is unlisted
  if (!params.isHash && dbFile.visibility === "unlisted") {
    console.log(
      `warning: someone tried to access the unlisted file: ${params.username}/${params.filename}`
    );
    return new Response("File not found", { status: 404 });
  }

  const filepath = `${STORE_DIR}/${dbFile.username}/${dbFile.hash}/data.${dbFile.extension}`;
  const file = Bun.file(filepath);

  const [start, end] = parseRange(req);

  console.log(start, end);

  return new Response(file.slice(start, end));
};
