import React from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import User from "../../models/userAccounts";
import dbConnect from "../../lib/dbConnect";
export default function Index() {
  return <div>Welcome to user homepage</div>;
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
