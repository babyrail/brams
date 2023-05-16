import React from "react";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { CustomSession } from "../api/auth/[...nextauth]";
import User from "../../models/userAccounts";
import dbConnect from "../../lib/dbConnect";
export default function Index() {
  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  return <div>
    <div className="container mx-auto">
      <div className=" mt-5 "><h1 className="text-2xl font-SegoeUI font-bold">Welcome, {session?.name}</h1></div>
    </div>
    <div className=" mt-5"></div>
  </div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  await dbConnect();
  console.log(session?.name);
  const user = await User.findOne({ username: session?.name });
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (!user.verified) {
    return {
      redirect: {
        destination: "/user/unverified",
        permanent: false,
      },
    };
  }

  return { props: { props: { session } } };
}
