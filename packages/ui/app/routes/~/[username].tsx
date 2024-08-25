import { createRoute } from "honox/factory";
import { ListFileResponse } from "../../lib/types";
import FileGrid from "../../islands/FileGrid";

export default createRoute(async (c) => {
  const { username } = c.req.param();
  const files = await fetch(`http://localhost:34997/list/${username}`)
    .then((res) => res.json())
    .then((d) => ListFileResponse.parse(d));

  return c.render(
    <div class={"flex flex-col gap-6"}>
      <h2>{`~/${username}`}</h2>
      <div class={"flex flex-col gap-1"}>
        <h2>upload</h2>
        {/* todo */}
      </div>
      <FileGrid files={files} />
    </div>
  );
});
