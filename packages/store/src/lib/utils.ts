import { fileTypeFromBuffer } from "file-type";
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

interface FileType {
  ext: string;
  mime: string;
}
export async function getFileType(
  file: File,
  buffer: Buffer
): Promise<FileType> {
  if (file.type && file.type.split("/").at(-1)) {
    return {
      ext: file.type.split("/").at(-1)!,
      mime: file.type,
    };
  } else {
    const fileType = await fileTypeFromBuffer(buffer);
    if (fileType) return fileType;

    return {
      ext: file.name ?? "bin",
      mime: "application/octet-stream",
    };
  }
}
