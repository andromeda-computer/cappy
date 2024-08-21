import backend from "./servers/backend";
import frontend from "./servers/frontend";

Bun.serve(frontend);
Bun.serve(backend);
