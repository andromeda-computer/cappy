"use client";
import { useState } from "react";
import { storeFileOld } from "../lib/serverActions";
import { useAtom } from "jotai";
import { usernameAtom } from "../atoms";

const FileUpload = () => {
  const [username, setUsername] = useAtom(usernameAtom);
  const [filename, setFilename] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: any) => {
    const input = e.target;
    if (input.files && input.files[0]) {
      setFile(input.files[0]);
      setFilename(input.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("data") as File;
    const metadata = {
      username: formData.get("username"),
      filename: formData.get("filename"),
      visibility: formData.get("visibility"),
    };

    await storeFileOld(file, metadata);
  };

  const isFormValid = file && username;

  return (
    <form onSubmit={handleSubmit} className={"grid grid-cols-2 gap-2 max-w-lg"}>
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
  );
};

export default FileUpload;
