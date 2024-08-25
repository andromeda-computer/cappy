import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>

      <body class="bg-neutral-800 min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div class="container mx-auto max-w-5xl flex-grow">
          <div class="p-6 sm:p-8 space-y-8">
            <h1>
              <a href="/" class={"no-underline text-neutral-200"}>
                cappy.space
              </a>
            </h1>
            {children}
          </div>

          <div class="text-center font-mono text-neutral-300 mt-8">
            built on andromeda.computer
          </div>
        </div>
      </body>
    </html>
  );
});
