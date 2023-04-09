import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

type MySession = Session & { expires?: string };

export default function NavBar() {
  const { data: session } = useSession() as {
    data: MySession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  const sesh = { ...session };
  return (
    <div>
      <div className="container-full bg-white shadow-md px-7 ">
        <div className="flex flex-row justify-between items-center ">
          <div className="flex flex-row items-center py-2  ">
            <img src="/barms-logo.png" alt="barms-logo" className="w-20" />
            <h1 className="font-Poppins font-semibold text-2xl ml-2 ">BARMS</h1>
          </div>
          {sesh.role === "admin" ? (
            <div className="hidden md:flex flex-row  w-5/12 justify-between py-2">
              <button className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins">
                <i className="fa-solid fa-user"></i> Manage <br /> Users
              </button>
              <button className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins">
                <i className="fa-solid fa-file-pen"></i>Manage <br /> Records
              </button>
              <button className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins">
                <i className="fa-solid fa-magnifying-glass"></i>Access
                <br /> Records
              </button>
              <button className=" px-5 py-3 text-customWhite flex flex-col justify-center items-center bg-blue-500 shadow-md rounded-xl font-Poppins">
                <i className="fa-solid fa-sack-xmark"></i> Ayuda <br />
                Management
              </button>
            </div>
          ) : (
            <></>
          )}
          {session && (
            <button
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
