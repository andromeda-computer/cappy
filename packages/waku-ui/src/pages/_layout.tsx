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
      <body className="bg-neutral-800 p-24 flex *:min-h-64 *:min-w-64 lg:m-0 lg:min-h-svh justify-center">
        <Providers>
          <div className="font-['Nunito']">
            <meta property="description" content={data.description} />
            <link rel="icon" type="image/png" href={data.icon} />
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
    description: "An internet website!",
    icon: "/images/favicon.png",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "static",
  };
};
