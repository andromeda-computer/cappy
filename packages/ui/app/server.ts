import { zValidator } from "@hono/zod-validator";
import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import {
  DatabaseMetadataSchema,
  ModifyMetadataRequestSchema,
} from "./lib/types";
import UsernamePage from "./routes/~/[username]";

const app = createApp();

app.post(
  "/m/:username{[a-zA-Z0-9_-]+}/:hash{[a-fA-F0-9]{64}}",
  zValidator("form", ModifyMetadataRequestSchema),
  async (c) => {
    const { username, hash } = c.req.param();
    const reqBody = c.req.valid("form");

    console.log({ username, hash, reqBody });

    await fetch(`http://localhost:34997/m/${username}/${hash}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((d) => DatabaseMetadataSchema.parse(d));

    return c.redirect(c.req.header("Referer") ?? "/");
  }
);

app.post(
  "/delete/:username{[a-zA-Z0-9_-]+}/:hash{[a-fA-F0-9]{64}}",
  async (c) => {
    const { username, hash } = c.req.param();

    await fetch(`http://localhost:34997/${username}/${hash}`, {
      method: "DELETE",
    });

    return c.redirect(c.req.header("Referer") ?? "/");
  }
);

app.post("/store", async (c) => {
  const body = await c.req.formData();
  const result = await fetch("http://localhost:34997/store", {
    method: "POST",
    // headers: r,
    body,
  })
    .then((res) => res.json())
    .then((d) => DatabaseMetadataSchema.parse(d));
  return c.json(result);
});

showRoutes(app);

export default app;
