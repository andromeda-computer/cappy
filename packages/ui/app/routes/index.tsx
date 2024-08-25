import { createRoute } from "honox/factory";
import { ListFileResponse } from "../lib/types";
import FileGrid from "../islands/FileGrid";
import { z } from "zod";

export default createRoute(async (c) => {
  const files = await fetch("http://localhost:34997/list")
    .then((res) => res.json())
    .then((d) => ListFileResponse.parse(d));
  const users = await fetch("http://localhost:34997/users")
    .then((r) => r.json())
    .then((d) => z.array(z.string()).parse(d));

  return c.render(
    <div class={"flex flex-col gap-6"}>
      <h2>~</h2>
      <div class={"flex flex-col gap-1"}>
        <h2>users</h2>
        {users.map((user) => (
          <a href={`/~/${user}`}>{user}</a>
        ))}
      </div>
      <FileGrid files={files} showUsername={true} />
    </div>
  );
});
