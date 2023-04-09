import React, { ReactNode, PropsWithChildren } from "react";
import { Session } from "next-auth";

import NavBar from "./NavBar";
import { getSession } from "next-auth/react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
  }
  return {
    props: { session },
  };
}
