import { Database } from "bun:sqlite";
import { STORE_DIR } from "./env";
import {
  DatabaseMetadataSchema,
  type DatabaseMetadata,
  type GetFileRequestURLParams,
} from "./types";
import fs from "fs";

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
