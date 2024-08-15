import { file } from "bun";
import { z } from "zod";

export const FileVisibilityEnum = z.enum(["public", "unlisted"]);

export const RequestMetadataSchema = z.object({
  username: z.string(),
  filename: z.string().optional(), // if filename is not given does it mean it should be unlisted?
  visibility: FileVisibilityEnum.default("unlisted"),
});

// NOTE at somepoint we may just store hashes on the disc and have metadata be written as shit goes. specifically
// two people can upload the same file, but the file is stored once, and metadata keeps track of the paths/filenames/etc.
export const DatabaseMetadataSchema = z.object({
  id: z.number().optional(),
  hash: z.string(),
  filename: z.string(),
  originalFilename: z.string(),
  username: z.string(),
  visibility: FileVisibilityEnum,
  createdAt: z.number(),
});

export type DatabaseMetadata = z.infer<typeof DatabaseMetadataSchema>;
