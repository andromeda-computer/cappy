import { Database } from "bun:sqlite";
import { STORE_DIR } from "./env";

const db = new Database(`${STORE_DIR}/db.sqlite`);
db.exec("PRAGMA journal_mode = WAL;");

db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    filename TEXT,
    folder TEXT,
    username TEXT NOT NULL,
    version INTEGER NOT NULL
);`);
