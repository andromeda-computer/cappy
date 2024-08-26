import { DatabaseMetadata } from "./types";

export const getFileURL = (file: DatabaseMetadata, hash: boolean = false) => {
  if (file.visibility === "unlisted" || hash) {
    return `http://localhost:8464/${file.username}/${file.hash}`;
  }

  return `http://localhost:8464/${file.username}/${encodeURIComponent(
    file.filename
  )}`;
};
