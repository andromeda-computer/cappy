import { z } from "zod";

// Define the schema for our environment variables
const EnvSchema = z.object({
  INTERNAL_SERVICE_PORT: z.string().regex(/^\d+$/).transform(Number),
  EXTERNAL_SERVICE_PORT: z.string().regex(/^\d+$/).transform(Number),
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

export const { INTERNAL_SERVICE_PORT, EXTERNAL_SERVICE_PORT, STORE_DIR } =
  envResult.data;
