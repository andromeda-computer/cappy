import { Hono } from "hono";
import { EXTERNAL_SERVICE_PORT, STORE_DIR } from "../lib/env";
import { logger } from "hono/logger";
import { getFile } from "../lib/db";

const app = new Hono();

app.use(logger());

app.get("/", async (c) => {
  return c.html("cappy");
});

app.get("/:username{[a-zA-Z0-9_-]+}/:filename", async (c) => {
  let { username, filename } = c.req.param();
  const isHash = /^[a-fA-F0-9]{64}$/.test(filename);
  const rangeHeader = c.req.header("Range");
  console.log({ rangeHeader });

  if (!isHash) username = decodeURIComponent(username);

  console.log({ username, filename, isHash });

  const dbFile = getFile({ username, filename, isHash });

  // if file not found
  if (!dbFile) return c.text("File not found", { status: 404 });

  // if file is unlisted
  if (!isHash && dbFile.visibility === "unlisted") {
    console.log(
      `warning: someone tried to access the unlisted file: ${username}/${filename}`
    );
    return c.text("File not found", { status: 404 });
  }

  const filepath = `${STORE_DIR}/${dbFile.username}/${dbFile.hash}/data.${dbFile.extension}`;
  const file = Bun.file(filepath);

  if (await file.exists()) {
    console.log(file.type);
    // @ts-ignore
    return c.body(file);
  } else {
    return c.text("File not found", { status: 404 });
  }
});

console.log(`Starting file server on port ${EXTERNAL_SERVICE_PORT}`);
export default {
  port: EXTERNAL_SERVICE_PORT,
  fetch: app.fetch,
};
