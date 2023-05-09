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
  const active = " bg-customBlack text-customWhite";
  const inactive = " bg-white text-customBlack";
  const defaultStyle =
    "w-full h-full px-5 py-3 flex flex-col justify-center items-center rounded-xl font-SegoeUI text-center transition-all duration-300 group-hover:bg-customBlack group-hover:text-customWhite";
  return (
    <div>
      <div className="container-full bg-black shadow-md px-7 relative z-100 h-[20vh] mb-16">
        <div className="flex flex-row justify-between items-center ">
          <Link href="/admin/home">
            <div className="flex flex-row items-center py-2  ">
              <img src="/barms-logo.png" alt="barms-logo" className="w-20" />
              <h1 className="font-Poppins font-bold text-2xl ml-2 text-customWhite">
                BARMS
              </h1>
            </div>
          </Link>
          {sesh.role === "superadmin" ? (
            <div className="hidden md:flex flex-row  w-2/3 justify-between py-2 absolute left-0 right-0 -bottom-10 mx-auto">
              <Link
                className=" h-32 flex justify-center items-center   shadow-md  shadow-slate-600 hover:shadow-inherit rounded-xl group"
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
                  <h1 className="font-SegoeUI font-bold text-xl ">
                    Manage Users
                  </h1>
                </div>
              </Link>
              <Link
                className=" h-32 flex justify-center items-center   shadow-md  shadow-slate-600 hover:shadow-inherit rounded-xl group"
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
                  <h1 className="font-SegoeUI font-bold text-xl ">
                    Manage Records
                  </h1>
                </div>
              </Link>
              <Link
                className=" h-32 flex justify-center items-center   shadow-md  shadow-slate-600 hover:shadow-inherit rounded-xl group"
                href="/admin/home"
              >
                <div
                  className={
                    router.pathname == "/admin/home"
                      ? defaultStyle + active
                      : defaultStyle + inactive
                  }
                >
                  <i className="fa-solid text-2xl fa-magnifying-glass"></i>
                  <h1 className="font-SegoeUI font-bold text-xl ">
                    Access Records
                  </h1>
                </div>
              </Link>
              <Link
                className=" h-32 flex justify-center items-center   shadow-md  shadow-slate-600 hover:shadow-inherit rounded-xl group"
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
                  <h1 className="font-SegoeUI font-bold text-xl ">
                    Ayuda Management
                  </h1>
                </div>
              </Link>
              <Link
                className=" h-32 flex justify-center items-center   shadow-md  shadow-slate-600 hover:shadow-inherit rounded-xl group"
                href="/admin/pages/createAnnouncements"
              >
                <div
                  className={
                    router.pathname == "/admin/pages/createAnnouncements"
                      ? defaultStyle + active
                      : defaultStyle + inactive
                  }
                >
                  <i className="fa-solid text-2xl fa-sack-xmark"></i>
                  <h1 className="font-SegoeUI font-bold text-xl ">
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
              className="bg-customWhite w-10  rounded-xl shadow-sm hover:bg-customBlack hover:text-customWhite transition-all duration-300"
            >
              <i className="text-2xl fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
