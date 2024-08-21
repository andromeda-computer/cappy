import { deleteFile, hashExists } from "../lib/db";
import { rm } from "node:fs/promises";
import { STORE_DIR } from "../lib/env";

export const deleteHandler = async (username: string, hash: string) => {
  if (!hashExists(username, hash))
    return new Response("File not found", { status: 404 });

  // delete file from disk
  await rm(`${STORE_DIR}/${username}/${hash}`, {
    force: true,
    recursive: true,
  });

  // delete file from db
  deleteFile(username, hash);

  return new Response("File deleted", { status: 200 });
};
