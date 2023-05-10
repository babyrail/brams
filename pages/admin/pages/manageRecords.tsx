import React from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
export default function manageRecords() {
  return (
    <div>
      <div className="container-full">
        <div className=" container mx-auto flex flex-col md:flex-row justify-center items-center md:flex-wrap gap-5 p-10 ">
          <Link
            href="/admin/pages/createRecord"
            className="flex flex-col justify-center items-center w-full md:w-1/3 h-60 bg-blue-500 rounded-xl shadow-md hover:cursor-pointer"
            data-attribute="manage-users"
          >
            <i className="fa-solid fa-user text-5xl text-customWhite"></i>
            <h1 className="font-Poppins font-semibold text-2xl text-customWhite">
              Create Record
            </h1>
          </Link>
          <Link
            href="/admin/pages/editRecords"
            className="flex flex-col justify-center items-center w-full md:w-1/3 h-60 bg-blue-500 rounded-xl shadow-md hover:cursor-pointer"
            data-attribute="access-records"
          >
            <i className="fa-solid fa-magnifying-glass text-5xl text-customWhite"></i>
            <h1 className="font-Poppins font-semibold text-2xl text-customWhite">
              Edit/Delete Records
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
        destination: "/admin",
        permanent: false,
      },
    };
  }
  if (sesh.role != "superadmin") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return { props: { ...session } };
}
