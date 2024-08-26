// TODO shouldnt need this file. Should just be an import from the other proj
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
  extension: z.string(),
  visibility: FileVisibilityEnum,
  createdAt: z.number(),
});

export const ListFileResponse = z.array(DatabaseMetadataSchema).nullable();

export type DatabaseMetadata = z.infer<typeof DatabaseMetadataSchema>;

export interface GetFileRequestURLParams {
  username: string;
  filename: string;
  isHash: boolean;
}

export const ModifyMetadataRequestSchema = z
  .object({
    visibility: FileVisibilityEnum.optional(),
    filename: z.string().optional(),
  })
  .refine(
    (d) => {
      if (!d.filename && !d.visibility) return false;
      return true;
    },
    { message: "Request must have visibility or filename" }
  );

export type ModifyMetadataRequest = z.infer<typeof ModifyMetadataRequestSchema>;
