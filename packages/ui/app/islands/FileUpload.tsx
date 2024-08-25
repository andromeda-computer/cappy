import { useState } from "hono/jsx";

const FileUpload = () => {
  const [username, setUsername] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      setFile(input.files[0]);
      setFilename(input.files[0].name);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const metadata = {
      username: formData.get("username"),
      filename: formData.get("filename") || undefined,
      visibility: formData.get("visibility"),
    };

    // Remove individual metadata fields from formData
    formData.delete("username");
    formData.delete("filename");
    formData.delete("visibility");

    // Add metadata as a JSON string
    formData.append("metadata", JSON.stringify(metadata));

    fetch("/store", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("File uploaded successfully");
          // Handle success (e.g., show a success message)
        } else {
          console.error("File upload failed");
          // Handle error (e.g., show an error message)
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // Handle error (e.g., show an error message)
      });
  };

  const isFormValid = file && username;

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      class={"grid grid-cols-2 gap-2 max-w-lg"}
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
        value={username}
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
        class={`col-span-2 mt-2 py-2 px-4 rounded ${
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
