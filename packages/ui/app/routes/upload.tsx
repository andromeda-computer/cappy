import { createRoute } from "honox/factory";
import FileUpload from "../islands/FileUpload";

export default createRoute((c) => {
  return c.render(
    <div class={"flex flex-col gap-6"}>
      <h2>upload</h2>
      <FileUpload />
    </div>
  );
});
