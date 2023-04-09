import React, { ReactNode, PropsWithChildren } from "react";
import { Session } from "next-auth";

import NavBar from "./NavBar";
import { getSession } from "next-auth/react";

interface Layout {
  children: ReactNode;
  session?: Session | null; // Include the session property of type Session or null
}
export const Layout: React.FC<Layout> = ({
  children,
  session,
}: PropsWithChildren<{}>) => {
  return (
    <>
      <NavBar props={session} />
      {children}
    </>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
  }
  return {
    props: { session },
  };
}
