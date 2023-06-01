import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function ayudaManagement() {
  return (
    <div className="ml-48 2xl:ml-56 pt-20 py-5">
      <div className="container mx-auto">
        <h1 className="text-2xl font-SegoeUI text-primary font-bold border-b py-2">
          Ayuda Management
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-5  place-items-center">
          <Link
            className="bg-white shadow-md rounded-md p-5 flex justify-center items-center aspect-square w-3/4 cursor-pointer hover:border-2 hover:border-customBlack transition-border duration-100 linear"
            href="/admin/pages/ayudaDistribution"
          >
            <div className="flex flex-col justify-center items-center">
              <i className="fa-solid fa-hand-holding-hand text-6xl text-customBlack"></i>
              <h3 className="font-SegoeUI text-2xl text-customBlack font-bold">
                Ayuda Distribution
              </h3>
            </div>
          </Link>

          <Link
            className="bg-white shadow-md rounded-md p-5 flex justify-center items-center aspect-square w-3/4 cursor-pointer hover:border-2 hover:border-customBlack transition-border duration-100 linear "
            href="/admin/pages/ayudaRecipientList"
          >
            <div className="flex flex-col justify-center items-center">
              <i className="fa-solid fa-clipboard-list text-6xl text-customBlack"></i>
              <h3 className="font-SegoeUI text-2xl text-customBlack font-bold">
                View Recipient's List
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
