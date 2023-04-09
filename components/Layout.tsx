import React, { ReactNode, PropsWithChildren } from "react";
import { Session } from "next-auth";

import NavBar from "./NavBar";
import { getSession } from "next-auth/react";

export const Layout: React.FC = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <NavBar />
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

export default Layout;
