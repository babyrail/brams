import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";
type MySession = Session & { expires?: string };

export default function NavBar() {
  const { data: session } = useSession() as {
    data: MySession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  const sesh = { ...session } as any;
  return (
    <div>
      <div className="container-full bg-white shadow-md px-7 ">
        <div className="flex flex-row justify-between items-center ">
          <Link href="/admin/home">
            <div className="flex flex-row items-center py-2  ">
              <img src="/barms-logo.png" alt="barms-logo" className="w-20" />
              <h1 className="font-Poppins font-semibold text-2xl ml-2 ">
                BARMS
              </h1>
            </div>
          </Link>
          {sesh.role === "superadmin" ? (
            <div className="hidden md:flex flex-row  w-5/12 justify-between py-2">
              <Link href="/admin/pages/manageUsers">
                <div className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins text-center">
                  <i className="fa-solid fa-user"></i> Manage <br /> Users
                </div>
              </Link>
              <Link href="/admin/pages/manageRecords">
                <div className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins text-center">
                  <i className="fa-solid fa-file-pen"></i>Manage <br /> Records
                </div>
              </Link>
              <Link href="/admin/pages/accessRecords">
                <div className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins text-center">
                  <i className="fa-solid fa-magnifying-glass"></i>Access
                  <br /> Records
                </div>
              </Link>
              <Link href="/admin/pages/ayudaManagement">
                <div className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins text-center">
                  <i className="fa-solid fa-sack-xmark"></i> Ayuda <br />
                  Management
                </div>
              </Link>
            </div>
          ) : (
            <></>
          )}
          {session && (
            <button
              type="button"
              title="sign out"
              onClick={() => {
                signOut();
              }}
              className="bg-customWhite w-10 aspect-square rounded-xl shadow-sm"
            >
              <i className="text-2xl fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
