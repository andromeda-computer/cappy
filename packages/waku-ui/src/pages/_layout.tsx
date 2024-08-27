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
