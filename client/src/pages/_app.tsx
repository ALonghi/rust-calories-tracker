import "@styles/global.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";
import Notifications from "@components/shared/Notifications/Notifications";
import Sidebar from "@components/shared/Sidebar";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (false) router.replace(`/login`); //fix with auth check
  }, []);
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
        <div className="w-full mx-auto min-h-[100vh]">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;
