import { DatabaseMetadata } from "../lib/types";
import { getFileURL } from "../lib/utils";

const DownloadButton = ({ file }: { file: DatabaseMetadata }) => {
  return (
    <button
      onClick={() => {
        window.location.href = getFileURL(file);
      }}
    >
      download
    </button>
  );
};

export default DownloadButton;
