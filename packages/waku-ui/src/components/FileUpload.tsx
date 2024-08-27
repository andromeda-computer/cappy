"use client";
import { useState } from "react";
import { FileUploadResponse, storeFileOld } from "../lib/serverActions";
import { useAtom } from "jotai";
import { usernameAtom } from "../atoms";

const FileUpload = () => {
  const [username, setUsername] = useAtom(usernameAtom);
  const [filename, setFilename] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<null | FileUploadResponse>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: any) => {
    const input = e.target;
    if (input.files && input.files[0]) {
      setFile(input.files[0]);
      setFilename(input.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setResponse(null);
    setIsUploading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("data") as File;
    const metadata = {
      username: formData.get("username"),
      filename: formData.get("filename"),
      visibility: formData.get("visibility"),
    };

    const r = await storeFileOld(file, metadata);
    setIsUploading(false);
    setResponse(r);
  };

  const isFormValid = file && username;

  return (
    <div className="self-center pt-6">
      <form
        onSubmit={handleSubmit}
        className={"grid grid-cols-2 gap-2 max-w-lg"}
      >
        <label htmlFor="file">File:</label>
        <input
          type="file"
          id="file"
          name="data"
          required
          onChange={handleFileChange}
        />
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={username ?? ""}
          onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
        />
        <label htmlFor="filename">Filename</label>
        <input
          type="text"
          id="filename"
          name="filename"
          value={filename}
          onChange={(e) => setFilename((e.target as HTMLInputElement).value)}
        />
        <label htmlFor="visibility">Visibility:</label>
        <select id="visibility" name="visibility" defaultValue="unlisted">
          <option value="unlisted">Unlisted</option>
          <option value="public">Public</option>
        </select>
        <button
          type="submit"
          className={`col-span-2 mt-2 py-2 px-4 rounded ${
            isFormValid
              ? "bg-purple-500 hover:bg-purple-600 text-white hover:text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Upload
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-1 items-center">
        {isUploading && <div className="mt-6">Uploading...</div>}
        {response && (
          <>
            {response.error && (
              <div className="text-red-500">Error: {response.error}</div>
            )}
            {response.data && (
              <>
                <div className="text-green-500">
                  {response.data.status === "new"
                    ? "File uploaded successfully"
                    : "Uploaded file already exists!"}
                </div>
                <div>Filename: {response.data.filename}</div>
                {response.data.visibility === "public" && <div>Public URL</div>}
                <div>URL</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
