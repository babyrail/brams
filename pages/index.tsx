import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import React from "react";

export default function Index({ ...session }) {
  return <></>;
}

interface CustomSession extends Session {
  role: string;
}

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const sesh = { ...session } as CustomSession;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (sesh?.role === "superadmin") {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  } else if (sesh?.role === "basic") {
    return {
      redirect: {
        destination: "/basic",
        permanent: false,
      },
    };
  } else if (sesh?.role === "user") {
    return {
      redirect: {
        destination: "/user",
        permanent: false,
      },
    };
  } else if (sesh?.role === "unverified") {
    return {
      redirect: {
        destination: "/user/unverified",
        permanent: false,
      },
    };
  } else {
    return {
      props: { session },
    };
  }
}
