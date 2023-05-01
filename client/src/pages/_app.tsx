import "@styles/global.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import Notifications from "@components/shared/Notifications/Notifications";
import Sidebar from "@components/shared/Sidebar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Calories tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="favicon.ico" />
      </Head>
      <div className="flex flex-row relative ">
        <Sidebar />
        <Notifications />
        <div className="w-full mx-auto">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;
