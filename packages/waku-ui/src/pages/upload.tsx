import FileUpload from "../components/FileUpload";

const UploadPage = () => {
  return (
    <div className={"flex flex-col gap-6"}>
      <h2>upload</h2>
      <FileUpload />
    </div>
  );
};

export default UploadPage;
