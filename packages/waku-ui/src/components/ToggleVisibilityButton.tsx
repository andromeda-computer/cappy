import { modifyMetadata } from "../lib/serverActions";
import { DatabaseMetadata } from "../lib/types";

const ToggleVisibilityButton = ({ file }: { file: DatabaseMetadata }) => {
  const newVisibility = file.visibility === "public" ? "unlisted" : "public";

  return (
    <form action={modifyMetadata} style={{ display: "inline" }}>
      <input type="hidden" name="username" value={file.username} />
      <input type="hidden" name="hash" value={file.hash} />
      <input type="hidden" name="visibility" value={newVisibility} />
      <button type="submit">
        {file.visibility === "public" ? "unlist" : "list"}
      </button>
    </form>
  );
};

export default ToggleVisibilityButton;
