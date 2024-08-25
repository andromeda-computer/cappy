import { DatabaseMetadata } from "../lib/types";

const DeleteFileButton = ({ file }: { file: DatabaseMetadata }) => {
  return (
    <form
      method="POST"
      action={`/delete/${file.username}/${file.hash}`}
      style={{ display: "inline" }}
    >
      <button type="submit">delete</button>
    </form>
  );
};

export default DeleteFileButton;
