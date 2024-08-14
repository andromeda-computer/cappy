import { Database } from "bun:sqlite";
import { STORE_DIR } from "./env";

const db = new Database(`${STORE_DIR}/db.sqlite`);
db.exec("PRAGMA journal_mode = WAL;");
