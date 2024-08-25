import { useState } from "hono/jsx";
import { DatabaseMetadata } from "../lib/types";
import { getFileURL } from "../lib/utils";

const TableFilename = ({ file }: { file: DatabaseMetadata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex gap-2 col-span-4">
      <button onClick={handleEditToggle} type="button">
        {isEditing ? "❌" : "📝"}
      </button>
      {isEditing ? (
        <form
          class={"flex gap-2"}
          method="POST"
          action={`/m/${file.username}/${file.hash}`}
          onSubmit={() => {
            // This will run before the form submits
            // You can add any client-side logic here if needed
          }}
        >
          <input
            type="text"
            name="filename"
            class={"bg-neutral-700 rounded-md px-2"}
            value={file.filename}
            autoFocus
          />
          <button type="submit">Save</button>
          {/* <button type="button" onClick={handleEditToggle}>
            Cancel
          </button> */}
        </form>
      ) : (
        <a href={getFileURL(file)} className="">
          {file.filename}
        </a>
      )}
    </div>
  );
};

export default TableFilename;
