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
  const router = useRouter();
  const sesh = { ...session } as any;
  const handleSignout = () => {
    signOut();
  };
  console.log(router.pathname);
  const active = " bg-highlight text-customWhite";
  const inactive = " bg-white text-customBlack  group-hover:bg-[#f2f2f2]";
  const defaultStyle =
    "w-full h-full px-5 py-3 flex gap-5 items-center  font-SegoeUI text-center transition-all duration-300 ";
  return (
    <div>
      <div className="h-screen fixed w-44 2xl:w-56 top-0 left-0 flex flex-col  bg-customBlack2 ">
        <div className="flex flex-col justify-between items-center h-full py-5">
          <Link href="/admin/home">
            <div className="flex flex-row items-center py-2  ">
              <img src="/barms-logo.png" alt="barms-logo" className="w-20" />
              <h1 className="font-Poppins font-bold text-lg 2xl:text-2xl ml-2 text-customWhite">
                BARMS
              </h1>
            </div>
          </Link>
          {sesh.role === "superadmin" ? (
            <div className="hidden md:flex flex-col w-full ">
              <Link
                className=" flex justify-center items-center   shadow-md   hover:shadow-inherit h-24 2xl:h-32  group w-full"
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
                  <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">Dashboard</h1>
                </div>
              </Link>
              <Link
                className=" flex justify-center items-center   shadow-md   hover:shadow-inherit h-24 2xl:h-32  group w-full"
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
                  <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">
                    Manage Records
                  </h1>
                </div>
              </Link>
              <Link
                className=" flex justify-center items-center   shadow-md   hover:shadow-inherit h-24 2xl:h-32  group w-full"
                href="/admin/pages/manageUsers"
              >
                <div
                  className={
                    router.pathname == "/admin/pages/manageUsers"
                      ? defaultStyle + active
                      : defaultStyle + inactive
                  }
                >
                  <i className="fa-solid text-2xl fa-user"></i>
                  <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">
                    Manage Admin Users
                  </h1>
                </div>
              </Link>
              <Link
                className=" flex justify-center items-center   shadow-md   hover:shadow-inherit h-24 2xl:h-32  group w-full"
                href="/admin/pages/ayudaManagement"
              >
                <div
                  className={
                    router.pathname == "/admin/pages/ayudaManagement"
                      ? defaultStyle + active
                      : defaultStyle + inactive
                  }
                >
                  <i className="fa-solid text-2xl fa-sack-xmark"></i>
                  <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">
                    Ayuda Management
                  </h1>
                </div>
              </Link>
              <Link
                className=" flex justify-center items-center   shadow-md   hover:shadow-inherit h-24 2xl:h-32  group w-full"
                href="/admin/pages/createAnnouncements"
              >
                <div
                  className={
                    router.pathname == "/admin/pages/createAnnouncements"
                      ? defaultStyle + active
                      : defaultStyle + inactive
                  }
                >
                  <i className="fa-solid text-2xl fa-bullhorn"></i>
                  <h1 className="font-SegoeUI font-bold text-sm 2xl:text-md ">
                    Announcements
                  </h1>
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
              onClick={handleSignout}
              className="bg-customWhite   shadow-sm hover:bg-highlight hover:text-customWhite transition-all duration-300 flex justify-center items-center gap-2 w-1/2 h-8 2xl:h-12 rounded-md"
            >
              <i className="text-lg 2xl:text-2xl fa-solid fa-arrow-right-from-bracket"></i>
              <span className="font-semibold 2xl:text-2xl text-sm">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
