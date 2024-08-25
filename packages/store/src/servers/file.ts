import { Hono } from "hono";
import { EXTERNAL_SERVICE_PORT } from "../lib/env";
import { getFileHandler } from "../handlers/public/getFile";
import { parseRange } from "../lib/utils";

const app = new Hono();

app.get("/", async (c) => {
  return c.html("cappy");
});

app.get(
  "/:username{[a-zA-Z0-9_-]+}/:filename{[a-fA-F0-9]{64}|[a-zA-Z0-9._-]+}",
  async (c) => {
    const { username, filename } = c.req.param();
    const isHash = /^[a-fA-F0-9]{64}$/.test(filename);
    const rangeHeader = c.req.header("Range");
    const range = parseRange(rangeHeader);

    return await getFileHandler({ username, filename, isHash }, range);
  }
);

console.log(`Starting file server on port ${EXTERNAL_SERVICE_PORT}`);
export default {
  port: EXTERNAL_SERVICE_PORT,
  fetch: app.fetch,
};
