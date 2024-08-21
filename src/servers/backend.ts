import { Hono } from "hono";

import { BASE_EXTERNAL_URL, INTERNAL_SERVICE_PORT } from "../lib/env";
import { storeHandler } from "../handlers/store";
import { listUserFiles } from "../lib/db";
import { deleteHandler } from "../handlers/delete";

const app = new Hono();

app.get("/", async (c) => {
  const template = await Bun.file("./src/ui/backend/index.html").text();
  const html = template.replace("{{BASE_URL}}", BASE_EXTERNAL_URL);

  return c.html(html);
});

app.get("/files/:username", async (c) => {
  const { username } = c.req.param();

  return c.json(await listUserFiles(username, true));
});

app.put("/store", async (c) => {
  console.log(c.req.raw);
  // TODO migrate to hono native
  return await storeHandler(c.req.raw);
});

app.delete(
  "/delete/:username{[a-zA-Z0-9_-]+}/:hash{[a-fA-F0-9]{64}}",
  async (c) => {
    const { username, hash } = c.req.param();
    console.log({ username, hash });
    return await deleteHandler(username, hash);
  }
);

console.log(`Starting backend server on port ${INTERNAL_SERVICE_PORT}`);
export default {
  port: INTERNAL_SERVICE_PORT,
  fetch: app.fetch,
};
