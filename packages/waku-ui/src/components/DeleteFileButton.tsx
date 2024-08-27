"use client";
import { deleteFile } from "../lib/serverActions";
import { DatabaseMetadata } from "../lib/types";

const DeleteFileButton = ({ file }: { file: DatabaseMetadata }) => {
  return (
    <form action={deleteFile} style={{ display: "inline" }}>
      <input type="hidden" name="username" value={file.username} />
      <input type="hidden" name="hash" value={file.hash} />
      <button type="submit">delete</button>
    </form>
  );
};

export default DeleteFileButton;
