import { Link } from "waku";
import { ListFileResponse } from "../lib/types";
import { z } from "zod";
import FileGrid from "../components/FileGrid";

export default async function HomePage() {
  const files = await fetch("http://localhost:34997/list")
    .then((res) => res.json())
    .then((d) => ListFileResponse.parse(d));
  const users = await fetch("http://localhost:34997/users")
    .then((r) => r.json())
    .then((d) => z.array(z.string()).parse(d));

  return (
    <div className={"flex flex-col gap-6"}>
      <h2>~</h2>
      <div className={"flex flex-col gap-1"}>
        <h2>users</h2>
        {users.map((user) => (
          <Link key={user} to={`/~/${user}`}>
            {user}
          </Link>
        ))}
      </div>
      <FileGrid files={files} showUsername={true} />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  };
};
