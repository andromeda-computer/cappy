import pages from "@hono/vite-cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: {
        input: ["/app/style.css"],
      },
    }),
    pages(),
  ],
  // resolve: {
  //   alias: {
  //     react: "hono/jsx",
  //     "react-dom": "hono/jsx/dom",
  //   },
  // },
});

// vite.config.ts
// import ssg from "@hono/vite-ssg";
// import honox from "honox/vite";
// import client from "honox/vite/client";
// import { defineConfig } from "vite";

// const entry = "./app/server.ts";

// export default defineConfig(({ mode }) => {
//   if (mode === "client") {
//     return {
//       plugins: [client()],
//     };
//   } else {
//     return {
//       build: {
//         emptyOutDir: false,
//       },
//       plugins: [honox(), ssg({ entry })],
//     };
//   }
// });
