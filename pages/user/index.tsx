import React from "react";
import { getSession } from "next-auth/react";
export default function BasicUser() {
  return <div>Basic User Landing page</div>;
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}
