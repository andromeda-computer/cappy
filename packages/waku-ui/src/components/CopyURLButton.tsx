"use client";

import { DatabaseMetadata } from "../lib/types";
import { getFileURL } from "../lib/utils";

const CopyURLButton = ({ file }: { file: DatabaseMetadata }) => {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(getFileURL(file));
      }}
      className={"text-purple-300 hover:text-purple-400"}
    >
      [copy url]
    </button>
  );
};

export default CopyURLButton;
