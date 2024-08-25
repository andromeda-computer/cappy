import { z } from "zod";
import { ListFileResponse } from "../lib/types";
import CopyURLButton from "../islands/CopyURLButton";
import DownloadButton from "../islands/DownloadURLButton";
import { getFileURL } from "../lib/utils";
import TimeAgo from "../islands/TimeAgo";
import ToggleVisibilityButton from "../components/ToggleVisibilityButton";
import DeleteFileButton from "../components/DeleteFileButton";
import TableFilename from "./TableFilename";

const FileGrid = ({
  files,
  showUsername = false,
}: {
  files: z.infer<typeof ListFileResponse>;
  showUsername?: boolean;
}) => {
  return (
    <div class={`grid gap-4 ${showUsername ? "grid-cols-12" : "grid-cols-11"}`}>
      <h2 class={"col-span-4"}>filename</h2>
      {showUsername && <h2>user</h2>}
      <h2>age</h2>
      <h2 class={"col-span-2"}>visibility</h2>
      <h2 class={"col-span-4"}>actions</h2>

      {files?.map((file) => (
        <>
          <TableFilename file={file} />
          {/* <div class={"flex gap-2 col-span-4"}>
            <button>📝</button>
            <a href={getFileURL(file)} class={""}>
              {file.filename}
            </a>
          </div> */}
          {showUsername && <p>{file.username}</p>}
          <TimeAgo timestamp={file.createdAt} />
          <div class={"flex gap-2 col-span-2"}>
            <p>{file.visibility}</p>
            <CopyURLButton file={file} />
          </div>
          <div class={"flex gap-2 text-purple-300 col-span-4"}>
            {/* <button>rename</button> */}
            <DeleteFileButton file={file} />
            <ToggleVisibilityButton file={file} />
            <DownloadButton file={file} />
          </div>
        </>
      ))}
    </div>
  );
};

export default FileGrid;
