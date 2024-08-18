import { getFileHandler, parseGetFileRequest } from "./handlers/public/getFile";
import { storeHandler } from "./handlers/store";
import { EXTERNAL_SERVICE_PORT, INTERNAL_SERVICE_PORT } from "./lib/env";

const startFrontendServer = () => {
  console.log(`Starting frontend server on port ${EXTERNAL_SERVICE_PORT}`);
  Bun.serve({
    port: EXTERNAL_SERVICE_PORT,
    fetch(req) {
      const url = new URL(req.url);
      const path = url.pathname;
      const parsed = parseGetFileRequest(path);

      if (parsed) return getFileHandler(req, parsed);
      if (path === "/") return new Response("cappy");

      return new Response("404");
    },
  });
};

const startBackendServer = () => {
  console.log(`Starting backend server on port ${INTERNAL_SERVICE_PORT}`);
  Bun.serve({
    port: INTERNAL_SERVICE_PORT,
    async fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/store") return await storeHandler(req);
      if (url.pathname === "/")
        return new Response(Bun.file("./src/ui/backend/index.html"));
      // TODO PATCH for updating metadata?
      // TODO this is a regex match on the path
      //   if (url.pathname === "/delete") return await deleteHandler(req);

      return new Response("404");
    },
  });
};

startFrontendServer();
startBackendServer();
