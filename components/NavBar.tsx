import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";
type MySession = Session & { expires?: string };

export default function NavBar() {
  const handleSignout = () => {
    signOut();
  };
  return (
    <div className="w-44 2xl:w-56 fixed top-0 left-0 bg-customBlack flex flex-col h-full  py-10">
      <div className="flex flex-col w-full justify-center items-center ">
        <img src="/barms-logo.png" alt="" className="w-3/4" />
      </div>
      <div className="flex flex-col  h-full gap-6 2xl:gap-14 mt-10 ">
        <div className="flex flex-col  px-5  ">
          <Link
            href="/user/"
            className="rounded-xl hover:bg-navBarHighlight transition-all duration-200 ease-in group "
          >
            <div className="flex flex-row items-center py-2 px-2 ">
              <i className="fa-solid fa-house text-xs 2xl:text-xs text-navBar group-hover:text-customWhite transition-all duration-200 ease-in"></i>
              <h1 className="font-Poppins font-bold text-xs 2xl:text-xs ml-5 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in">
                Home
              </h1>
            </div>
          </Link>
          <Link
            href="/user/events"
            className="rounded-xl hover:bg-navBarHighlight transition-all duration-200 ease-in group "
          >
            <div className="flex flex-row items-center py-2 px-2 ">
              <i className="fa-solid fa-calendar text-xs 2xl:text-xs text-navBar group-hover:text-customWhite transition-all duration-200 ease-in"></i>
              <h1 className="font-Poppins font-bold text-xs 2xl:text-xs ml-5 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in">
                Events
              </h1>
            </div>
          </Link>
          <Link
            href="/user/profile"
            className="rounded-xl hover:bg-navBarHighlight transition-all duration-200 ease-in group "
          >
            <div className="flex flex-row items-center py-2 px-2 ">
              <i className="fa-solid fa-user text-xs 2xl:text-xs text-navBar group-hover:text-customWhite transition-all duration-200 ease-in"></i>
              <h1 className="font-Poppins font-bold text-xs 2xl:text-xs ml-5 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in">
                Profile
              </h1>
            </div>
          </Link>
        </div>
        <div className="flex flex-col  px-5">
          <h1 className="font-Poppins font-bold text-xs 2xl:text-xs  text-white">
            Processes
          </h1>
          <div className="flex flex-col gap-3 mt-3 ">
            <Link
              href="/user/request/request-document"
              className=" rounded-xl hover:bg-navBarHighlight group transition-all duration-200 ease-in "
            >
              <div className="flex flex-row items-center py-2 px-2 ">
                <i className="fa-solid fa-file text-xs 2xl:text-xs text-navBar group-hover:text-customWhite transition-all duration-200 ease-in"></i>
                <h1 className="font-Poppins font-bold text-xs 2xl:text-xs ml-5 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in ">
                  Document Request
                </h1>
              </div>
            </Link>
            <Link
              href="/user/request/request-status"
              className=" rounded-xl hover:bg-navBarHighlight group transition-all duration-200 ease-in "
            >
              <div className="flex flex-row items-center py-2 px-2 ">
                <i className="fa-solid fa-file text-xs 2xl:text-xs text-navBar group-hover:text-customWhite transition-all duration-200 ease-in"></i>
                <h1 className="font-Poppins font-bold text-xs 2xl:text-xs ml-5 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in ">
                  Request Status
                </h1>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col  px-5">
          <h1 className="font-Poppins font-bold text-xs 2xl:text-xs  text-white">
            Services
          </h1>
          <div className="flex flex-col gap-3 mt-3 ">
            <Link
              href="/user/request/qwe"
              className=" rounded-xl hover:bg-navBarHighlight group transition-all duration-200 ease-in "
            >
              <div className="flex flex-row items-center py-2 px-2 ">
                <i className="fa-solid fa-file text-xs 2xl:text-xs text-navBar group-hover:text-customWhite transition-all duration-200 ease-in"></i>
                <h1 className="font-Poppins font-bold text-xs 2xl:text-xs ml-5 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in ">
                  Emergency Services
                </h1>
              </div>
            </Link>
            <Link
              href="/user/request/asd"
              className=" rounded-xl hover:bg-navBarHighlight group transition-all duration-200 ease-in "
            >
              <div className="flex flex-row items-center py-2 px-2 ">
                <i className="fa-solid fa-file text-xs 2xl:text-xs text-navBar group-hover:text-customWhite transition-all duration-200 ease-in"></i>
                <h1 className="font-Poppins font-bold text-xs 2xl:text-xs ml-5 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in ">
                  Health Services
                </h1>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col  px-5">
          <button
            className=" rounded-xl hover:bg-navBarHighlight group transition-all duration-200 ease-in "
            onClick={handleSignout}
          >
            <div className="flex flex-row items-center py-2 px-2 ">
              <i className="text-lg fa-solid fa-arrow-right-from-bracket text-navBar"></i>
              <h1 className="font-Poppins font-bold text-xs 2xl:text-xs  ml-3 text-navBar group-hover:text-customWhite transition-all duration-200 ease-in">
                Logout
              </h1>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
