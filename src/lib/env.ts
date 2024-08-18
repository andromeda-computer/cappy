import { z } from "zod";

// Define the schema for our environment variables
const EnvSchema = z.object({
  INTERNAL_SERVICE_PORT: z.string().regex(/^\d+$/).transform(Number),
  EXTERNAL_SERVICE_PORT: z.string().regex(/^\d+$/).transform(Number),
  EXTERNAL_SERVICE_DOMAIN: z.string(),
  STORE_DIR: z.string().default("./.store"),
});

// Validate the environment variables
const envResult = EnvSchema.safeParse(process.env);

if (!envResult.success) {
  console.error("Environment variable validation failed:");
  envResult.error.issues.forEach((issue) => {
    console.error(`- ${issue.path}: ${issue.message}`);
  });
  process.exit(1);
}

export const {
  INTERNAL_SERVICE_PORT,
  EXTERNAL_SERVICE_PORT,
  STORE_DIR,
  EXTERNAL_SERVICE_DOMAIN,
} = envResult.data;

export const isDev = process.env.NODE_ENV === "development";

export const BASE_INTERNAL_URL = isDev
  ? `http://localhost:${INTERNAL_SERVICE_PORT}`
  : `https://http://cjs-mac-mini-2.tail73f30.ts.net:${INTERNAL_SERVICE_PORT}`;

export const BASE_EXTERNAL_URL = isDev
  ? `http://localhost:${EXTERNAL_SERVICE_PORT}`
  : EXTERNAL_SERVICE_DOMAIN;
