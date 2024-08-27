import { z } from "zod";
import { ListFileResponse } from "../lib/types";
import TableFilename from "./TableFilename";
import CopyURLButton from "./CopyURLButton";
import DeleteFileButton from "./DeleteFileButton";
import ToggleVisibilityButton from "./ToggleVisibilityButton";
import DownloadButton from "./DownloadURLButton";
import React from "react";
import TimeAgo from "./TimeAgo";

const FileGrid = ({
  files,
  showUsername = false,
}: {
  files: z.infer<typeof ListFileResponse>;
  showUsername?: boolean;
}) => {
  return (
    <div
      className={`grid gap-4 ${showUsername ? "grid-cols-10" : "grid-cols-9"}`}
    >
      <h2 className={"col-span-4"}>filename</h2>
      {showUsername && <h2>user</h2>}
      <h2>age</h2>
      <h2 className={"col-span-2"}>visibility</h2>
      <h2 className={"col-span-2 justify-self-end"}>actions</h2>

      {files?.map((file, idx) => (
        <React.Fragment key={idx}>
          <TableFilename file={file} />
          {showUsername && <p>{file.username}</p>}
          <TimeAgo timestamp={file.createdAt} />
          <div className={"flex gap-2 col-span-2"}>
            <p>{file.visibility}</p>
            <CopyURLButton file={file} />
          </div>
          <div className={"flex gap-2 text-purple-300 col-span-2 justify-end"}>
            {/* <button>rename</button> */}
            <DeleteFileButton file={file} />
            <ToggleVisibilityButton file={file} />
            <DownloadButton file={file} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FileGrid;
