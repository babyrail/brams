import React from "react";
import { getSession, useSession } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";
type MySession = Session & { expires?: string };
export default function Admin() {
  const { data: session } = useSession() as {
    data: MySession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  const sesh = { ...session };
  return (
    <div>
      <h1 className="text-2xl font-Poppins font-bold text-center mt-10 mb-5 text-customBlack">
        Welcome, {sesh?.user?.name?.toUpperCase()}
      </h1>
      <div className="container-full">
        <div className=" container mx-auto flex flex-col md:flex-row justify-center items-center md:flex-wrap gap-5 p-10 ">
          <Link
            href="/admin/pages/manageUsers"
            className="flex flex-col justify-center items-center w-full md:w-1/3 h-60 bg-blue-500 rounded-xl shadow-md hover:cursor-pointer"
            data-attribute="manage-users"
          >
            <i className="fa-solid fa-user text-5xl text-customWhite"></i>
            <h1 className="font-Poppins font-semibold text-2xl text-customWhite">
              Manage Users
            </h1>
          </Link>
          <Link
            href="/admin/pages/manageRecords"
            className="flex flex-col justify-center items-center w-full md:w-1/3 h-60 bg-blue-500 rounded-xl shadow-md hover:cursor-pointer"
            data-attribute="manage-records"
          >
            <i className="fa-solid fa-file-pen text-5xl text-customWhite"></i>
            <h1 className="font-Poppins font-semibold text-2xl text-customWhite">
              Manage Records
            </h1>
          </Link>
          <Link
            href="/admin/pages/accessRecords"
            className="flex flex-col justify-center items-center w-full md:w-1/3 h-60 bg-blue-500 rounded-xl shadow-md hover:cursor-pointer"
            data-attribute="access-records"
          >
            <i className="fa-solid fa-magnifying-glass text-5xl text-customWhite"></i>
            <h1 className="font-Poppins font-semibold text-2xl text-customWhite">
              Access Records
            </h1>
          </Link>
          <Link
            href="/admin/pages/ayudaManagement"
            className="flex flex-col justify-center items-center w-full md:w-1/3 h-60 bg-blue-500 rounded-xl shadow-md hover:cursor-pointer"
            data-attribute="ayuda-mngmt"
          >
            <i className="fa-solid fa-sack-xmark text-5xl text-customWhite"></i>
            <h1 className="font-Poppins font-semibold text-2xl text-customWhite">
              Ayuda Management
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface CustomSession extends Session {
  role: string;
}

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
  if (sesh.role != "superadmin" && sesh.role != "admin") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return { props: { ...session } };
}
