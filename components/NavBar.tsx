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
  const handleSignout = () => {
    signOut();
  };
  return (
    <div>
      <div className="w-44 2xl:w-56 fixed top-0 left-0 bg-customBlack flex flex-col h-full">
        <div className="flex flex-col justify-between items-center h-full">
          <Link href="/admin/home">
            <div className="flex flex-row items-center py-2 ">
              <img src="/barms-logo.png" alt="barms-logo" className="w-16" />
              <h1 className="font-Poppins font-semibold text-lg ml-2 text-white">
                BARMS
              </h1>
            </div>
          </Link>
          <div className="w-full flex flex-col">
            <Link
              href="/user/"
              className="border w-full text-center bg-white h-24 grid place-items-center font-SegoeUI font-bold"
            >
              <h1>Announcements</h1>
            </Link>
            <Link
              href="/user/request-documents"
              className="border w-full text-center bg-white h-24 grid place-items-center font-SegoeUI font-bold"
            >
              <h1>Request Documents</h1>
            </Link>
          </div>
          {session && (
            <button
              type="button"
              title="sign out"
              onClick={handleSignout}
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
