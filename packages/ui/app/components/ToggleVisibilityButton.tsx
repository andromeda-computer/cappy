import { DatabaseMetadata } from "../lib/types";

const ToggleVisibilityButton = ({ file }: { file: DatabaseMetadata }) => {
  const newVisibility = file.visibility === "public" ? "unlisted" : "public";

  return (
    <form
      method="POST"
      action={`/m/${file.username}/${file.hash}`}
      style={{ display: "inline" }}
    >
      <input type="hidden" name="visibility" value={newVisibility} />
      <button type="submit">
        {file.visibility === "public" ? "unlist" : "list"}
      </button>
    </form>
  );
};

export default ToggleVisibilityButton;
