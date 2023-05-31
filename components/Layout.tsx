import React, { ReactNode, PropsWithChildren, useState } from "react";
import { Session } from "next-auth";
import { CustomSession } from "../pages/api/auth/[...nextauth]";
import NavBar from "./NavBar";
import AdminNavBar from "./AdminNavBar";
import { getSession, useSession } from "next-auth/react";
import PageLoader from "./pageLoader";
import { useRouter } from "next/router";
export default function Layout({ children }: PropsWithChildren<{}>) {
  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  const [loading, setLoading] = useState(false);
  console.log(session?.role);
  const router = useRouter();
  router.events?.on("routeChangeStart", () => {
    setLoading(true);
  });
  router.events?.on("routeChangeComplete", () => {
    setLoading(false);
  });
  return (
    <>
      {session?.role === "admin" || session?.role === "superadmin" ? (
        <AdminNavBar />
      ) : (
        session && <NavBar />
      )}
      {children}
      <PageLoader loading={loading} />
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
