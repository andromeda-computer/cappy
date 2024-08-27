import apiServer from "./servers/api";
import fileServer from "./servers/file";

Bun.serve(apiServer);
Bun.serve(fileServer);
