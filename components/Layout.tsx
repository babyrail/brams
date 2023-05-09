import React, { ReactNode, PropsWithChildren } from "react";
import { Session } from "next-auth";
import { CustomSession } from "../pages/api/auth/[...nextauth]";
import NavBar from "./NavBar";
import AdminNavBar from "./AdminNavBar";
import { getSession, useSession } from "next-auth/react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  console.log(session?.role);
  return (
    <>
      {session?.role === "admin" || session?.role === "superadmin" ? (
        <AdminNavBar />
      ) : null}
      {children}
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const sesh = { ...session };
  if (!session) {
  }
  return {
    props: { sesh },
  };
}
