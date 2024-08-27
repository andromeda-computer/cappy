import { Database } from "bun:sqlite";
import { STORE_DIR } from "./env";
import {
  DatabaseMetadataSchema,
  type FileVisibility,
  type DatabaseMetadata,
  type GetFileRequestURLParams,
} from "./types";
import fs from "fs";
import { z } from "zod";

fs.mkdirSync(STORE_DIR, { recursive: true });

export const db = new Database(`${STORE_DIR}/db.sqlite`);
db.exec("PRAGMA journal_mode = WAL;");

db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    filename TEXT NOT NULL,
    originalFilename TEXT NOT NULL,
    username TEXT NOT NULL,
    extension TEXT NOT NULL,
    visibility TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    UNIQUE(username, filename)
);`);

export const listFiles = (
  limit: number = 10,
  order: "ASC" | "DESC" = "DESC",
  includeUnlisted: boolean = false
) => {
  const query = db.query(`
    SELECT * FROM files
    ${includeUnlisted ? "" : "WHERE visibility = 'public'"}
    ORDER BY createdAt ${order}
    LIMIT ${limit}
  `);
  const results = query.all();

  if (results) return results.map((r) => DatabaseMetadataSchema.parse(r));

  return null;
};

export const listUserFiles = (
  username: string,
  includeUnlisted: boolean = false
) => {
  const query = db.query(`
    SELECT * FROM files WHERE username = $username
    ${includeUnlisted ? "" : "AND visibility = 'public'"}
  `);
  const results = query.all({ $username: username });

  if (results) return results.map((r) => DatabaseMetadataSchema.parse(r));

  return null;
};

export const deleteFile = (username: string, hash: string) => {
  const query = db.query(`
    DELETE FROM files WHERE username = $username AND hash = $hash
  `);
  return query.run({ $username: username, $hash: hash });
};

export const fileExists = (username: string, filename: string) => {
  const query = db.query(
    `SELECT * FROM files WHERE username = $username AND filename = $filename`
  );
  const result = query.get({ $username: username, $filename: filename });
  if (result) return DatabaseMetadataSchema.parse(result);
  return null;
};

export const hashExists = (username: string, hash: string) => {
  const query = db.query(
    `SELECT * FROM files WHERE username = $username AND hash = $hash`
  );
  const result = query.get({ $username: username, $hash: hash });
  if (result) return DatabaseMetadataSchema.parse(result);
  return null;
};

export const getUsers = () => {
  const query = db.query(`
    SELECT DISTINCT username FROM files
  `);
  const results = query.all();
  const parsed = z.array(z.object({ username: z.string() })).parse(results);
  return parsed.map((r) => r.username);
};

export const getFile = (params: GetFileRequestURLParams) => {
  const query = db.query(`
    SELECT * FROM files 
    WHERE username = $username 
      AND (
        ($isHash = 0 AND filename = $searchTerm)
        OR 
        ($isHash = 1 AND hash = $searchTerm)
      )
  `);

  const result = query.get({
    $username: params.username,
    $searchTerm: params.filename,
    $isHash: params.isHash ? 1 : 0,
  });

  if (result) return DatabaseMetadataSchema.parse(result);
  return null;
};

export const insertFile = (metadata: DatabaseMetadata) => {
  const query = db.query(`
        INSERT INTO files (hash, filename, originalFilename, username, visibility, createdAt, extension) 
        VALUES ($hash, $filename, $originalFilename, $username, $visibility, $createdAt, $extension)
    `);
  return query.run({
    $hash: metadata.hash,
    $filename: metadata.filename,
    $originalFilename: metadata.originalFilename,
    $username: metadata.username,
    $visibility: metadata.visibility,
    $createdAt: metadata.createdAt,
    $extension: metadata.extension,
  });
};

export const updateFile = (params: {
  username: string;
  hash: string;
  visibility?: FileVisibility;
  filename?: string;
}) => {
  if (params.visibility) {
    const query = db.query(`
      UPDATE files SET visibility = $visibility WHERE username = $username AND hash = $hash
    `);
    query.run({
      $visibility: params.visibility,
      $username: params.username,
      $hash: params.hash,
    });
  }

  if (params.filename) {
    const query = db.query(`
      UPDATE files SET filename = $filename WHERE username = $username AND hash = $hash
    `);
    query.run({
      $filename: params.filename,
      $username: params.username,
      $hash: params.hash,
    });
  }
};
