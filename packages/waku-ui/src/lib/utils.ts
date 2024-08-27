import { DatabaseMetadata } from "./types";

export const getFileURL = (file: DatabaseMetadata, hash: boolean = false) => {
  if (file.visibility === "unlisted" || hash) {
    return `${process.env.WAKU_PUBLIC_URL}/${file.username}/${file.hash}`;
  }

  return `${process.env.WAKU_PUBLIC_URL}/${file.username}/${encodeURIComponent(
    file.filename
  )}`;
};
