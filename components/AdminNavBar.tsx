import React from "react";
import Link from "next/link";
import { CustomSession } from "../pages/api/auth/[...nextauth]";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
export default function AdminNavBar() {
  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };

  const sesh = { ...session } as CustomSession;
  const router = useRouter();
  const handleSignout = () => {
    signOut();
  };
  console.log(router.pathname);
  const active = " bg-navBarHighlight text-customWhite";
  const inactive = "   group-hover:bg-navBarHighlight";
  const linkActive =
    "after:absolute   after:border-r-15 after:border-r-customWhite after:border-y-15 after:border-y-transparent after:border-customBlue after:top-1/2 after:-translate-y-1/2 after:right-0 ";
  const linkDefault = " flex px-10  group w-full relative";
  const defaultStyle =
    "   flex  items-center gap-5 font-SegoeUI text-center transition-all duration-300 px-2 py-1 rounded-xl text-customWhite";
  return (
    <div className="w-44 2xl:w-56 fixed top-0 left-0 bg-customBlack md:flex flex-col h-full  py-10 hidden ">
      <div className="flex flex-col w-full justify-center items-center ">
        <img src="/barms-logo.png" alt="" className="w-3/4" />
      </div>
      <div className="flex flex-col  h-full gap-6 2xl:gap-14 mt-10">
        <Link
          className={`${
            router.pathname == "/admin/dashboard"
              ? linkActive + linkDefault
              : linkDefault
          }`}
          href="/admin/dashboard"
        >
          <div
            className={
              `${
                router.pathname == "/admin/dashboard"
                  ? defaultStyle + active
                  : defaultStyle + inactive
              }` + " flex"
            }
          >
            <i className="fa-solid fa-gauge text-2xl"></i>
            <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md text-left">
              Dashboard
            </h1>
          </div>
        </Link>
        <Link
          className={`${
            router.pathname == "/admin/pages/manageRecords"
              ? linkActive + linkDefault
              : linkDefault
          }`}
          href="/admin/pages/manageRecords"
        >
          <div
            className={
              router.pathname == "/admin/pages/manageRecords"
                ? defaultStyle + active
                : defaultStyle + inactive
            }
          >
            <i className="fa-solid text-2xl fa-file-pen"></i>
            <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md text-left">
              Manage Records
            </h1>
          </div>
        </Link>
        <Link
          className={`${
            router.pathname == "/admin/pages/manageUsers"
              ? linkActive + linkDefault
              : linkDefault
          }`}
          href="/admin/pages/manageUsers"
        >
          <div
            className={
              `${
                router.pathname == "/admin/pages/manageUsers"
                  ? defaultStyle + active
                  : defaultStyle + inactive
              }` + " flex"
            }
          >
            <i className="fa-solid text-2xl fa-user"></i>
            <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">
              Manage Admin Users
            </h1>
          </div>
        </Link>
        <Link
          className={`${
            router.pathname == "/admin/pages/ayudaManagement"
              ? linkActive + linkDefault
              : linkDefault
          }`}
          href="/admin/pages/ayudaManagement"
        >
          <div
            className={
              `${
                router.pathname == "/admin/pages/ayudaManagement"
                  ? defaultStyle + active
                  : defaultStyle + inactive
              }` + " flex"
            }
          >
            <i className="fa-solid text-2xl fa-sack-xmark"></i>
            <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">
              Ayuda Management
            </h1>
          </div>
        </Link>
        <Link
          className={`${
            router.pathname == "/admin/pages/createAnnouncements"
              ? linkActive + linkDefault
              : linkDefault
          }`}
          href="/admin/pages/createAnnouncements"
        >
          <div
            className={
              `${
                router.pathname == "/admin/pages/createAnnouncements"
                  ? defaultStyle + active
                  : defaultStyle + inactive
              }` + " flex"
            }
          >
            <i className="fa-solid text-2xl fa-bullhorn"></i>
            <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">
              Announcements
            </h1>
          </div>
        </Link>
        <div className="px-10 w-full ">
          <button
            type="button"
            title="sign out"
            onClick={handleSignout}
            className="border-2 text-customWhite border-customWhite   shadow-sm hover:bg-customWhite hover:text-customBlack transition-all duration-300 flex justify-center items-center gap-2 w-full h-8 2xl:h-12 rounded-md"
          >
            <i className="text-lg 2xl:text-2xl fa-solid fa-arrow-right-from-bracket"></i>
            <span className="font-semibold 2xl:text-md text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
