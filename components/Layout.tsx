import React, { PropsWithChildren } from "react";
import NavBar from "./NavBar";
import { getSession } from "next-auth/react";
export default function Layout({ children, session }: PropsWithChildren<{}>) {
  return (
    <>
      <NavBar props={session} />
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
