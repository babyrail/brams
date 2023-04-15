import "../styles/globals.css";
import Head from "next/head";
import NavBar from "../components/NavBar";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import React from "react";

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (Component.name === "Login" || Component.name === "Signup") {
    return (
      <>
        <SessionProvider session={pageProps.session}>
          <Head>
            <title>BARMS - Barangay Ayuda and Records Management System</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </SessionProvider>
      </>
    );
  }
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Head>
            <title>BARMS - Barangay Ayuda and Records Management System</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
};

export default MyApp;
