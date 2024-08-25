import { STORE_DIR } from "./env";
import { type DatabaseMetadata, DatabaseMetadataSchema } from "./types";

export function parseRange(range?: string): [number, number] {
  if (!range) {
    return [0, Infinity];
  }

  const parts = range.split("=").at(-1)?.split("-") ?? [];
  const [startStr, endStr] = parts;

  const start = Number(startStr) || 0;
  const end = endStr ? Number(endStr) : Infinity;

  return [start, end];
}

export function getFilePath(username: string, hash: string) {
  return `${STORE_DIR}/${username}/${hash}`;
}

export async function getFileMetadata(username: string, hash: string) {
  return await DatabaseMetadataSchema.parse(
    await Bun.file(`${getFilePath(username, hash)}/metadata.json`).json()
  );
}

export async function writeFileMetadata(metadata: DatabaseMetadata) {
  const path = getFilePath(metadata.username, metadata.hash);
  await Bun.write(`${path}/metadata.json`, JSON.stringify(metadata));
}
