import { Hono } from "hono";

import { BASE_EXTERNAL_URL, INTERNAL_SERVICE_PORT } from "../lib/env";
import { storeHandler } from "../handlers/store";
import {
  getUsers,
  hashExists,
  listFiles,
  listUserFiles,
  updateFile,
} from "../lib/db";
import { deleteHandler } from "../handlers/delete";
import { zValidator } from "@hono/zod-validator";
import { ModifyMetadataRequestSchema } from "../lib/types";
import { getFileMetadata, writeFileMetadata } from "../lib/utils";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

// TODO is this a POST instead, optional username and whatever else
app.get("/list", async (c) => {
  return c.json(await listFiles(20, "DESC", true));
});

app.get("/list/:username", async (c) => {
  const { username } = c.req.param();

  return c.json(await listUserFiles(username, true));
});

// TODO support emoji users i think
app.get("/users", async (c) => {
  return c.json(getUsers());
});

app.post(
  "/m/:username{[a-zA-Z0-9_-]+}/:hash{[a-fA-F0-9]{64}}",
  zValidator("json", ModifyMetadataRequestSchema),
  async (c) => {
    const { username, hash } = c.req.param();
    const reqBody = c.req.valid("json");

    if (!hashExists(username, hash))
      return new Response("File not found", { status: 404 });

    updateFile({ ...reqBody, username, hash });

    // get the file from the disk
    const currMetadata = await getFileMetadata(username, hash);
    const metadata = { ...currMetadata, ...reqBody };

    // write the metadata to the disk
    await writeFileMetadata(metadata);

    return c.json(metadata);
  }
);

app.post("/store", async (c) => {
  console.log(c.req.raw);
  // TODO migrate to hono native
  return await storeHandler(c.req.raw);
});

app.delete("/:username{[a-zA-Z0-9_-]+}/:hash{[a-fA-F0-9]{64}}", async (c) => {
  const { username, hash } = c.req.param();
  console.log({ username, hash });
  return await deleteHandler(username, hash);
});

console.log(`Starting api server on port ${INTERNAL_SERVICE_PORT}`);
export default {
  port: INTERNAL_SERVICE_PORT,
  fetch: app.fetch,
};
