import FileGrid from "../../components/FileGrid";
import { ListFileResponse } from "../../lib/types";

const UserFilesPage = async ({ username }: { username: string }) => {
  console.log(username);
  const files = await fetch(`http://localhost:34997/list/${username}`)
    .then((res) => res.json())
    .then((d) => ListFileResponse.parse(d));

  return (
    <div className={"flex flex-col gap-6"}>
      <h2>{`~/${username}`}</h2>

      <FileGrid files={files} />
    </div>
  );
};

export default UserFilesPage;
