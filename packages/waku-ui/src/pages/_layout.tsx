import "../styles.css";

import type { ReactNode } from "react";

import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Providers } from "../components/Providers";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getData();

  return (
    <html>
      <head></head>
      <body className="bg-neutral-800 flex justify-center p-4 sm:p-8 md:p-16">
        <Providers>
          <div className="font-['Nunito'] w-full max-w-4xl flex flex-col min-h-screen">
            <meta property="description" content={data.description} />
            <link rel="icon" type="image/png" href={data.icon} />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/images/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/images/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/images/favicon-16x16.png"
            />
            <Header />
            <main className="">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

const getData = async () => {
  const data = {
    description: "cappy",
    icon: "/images/favicon.png",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "static",
  };
};
