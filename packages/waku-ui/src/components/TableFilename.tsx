"use client";
import { FormEvent, useState } from "react";
import { DatabaseMetadata } from "../lib/types";
import { getFileURL } from "../lib/utils";
import { modifyMetadata } from "../lib/serverActions";

const TableFilename = ({ file }: { file: DatabaseMetadata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await modifyMetadata(formData);
    handleEditToggle();
  };

  return (
    <div className="flex gap-2 col-span-4">
      <button onClick={handleEditToggle} type="button">
        {isEditing ? "❌" : "📝"}
      </button>
      {isEditing ? (
        <form className={"flex gap-2"} onSubmit={handleSubmit}>
          <input type="hidden" name="username" value={file.username} />
          <input type="hidden" name="hash" value={file.hash} />
          <input
            type="text"
            name="filename"
            className={"bg-neutral-700 rounded-md px-2"}
            defaultValue={file.filename}
            autoFocus
          />
          <button type="submit">Save</button>
          {/* <button type="button" onClick={handleEditToggle}>
            Cancel
          </button> */}
        </form>
      ) : (
        <a href={getFileURL(file)} target="_blank">
          {file.filename}
        </a>
      )}
    </div>
  );
};

export default TableFilename;
