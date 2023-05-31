import React, { useState } from "react";
import { ScaleLoader } from "react-spinners";
export default function PageLoader({ loading }: { loading: boolean }) {
  const defaultStyle = "hidden";
  const activeStyle = "block";
  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-customBlack bg-opacity-50 z-50 flex justify-center items-center ${
          loading ? activeStyle : defaultStyle
        }`}
      >
        <div className="bg-white p-10 rounded-md shadow-md">
          <h1 className="font-SegoeUI font-bold text-2xl text-primary">
            <ScaleLoader color="#1D4ED8" />
          </h1>
        </div>
      </div>
    </div>
  );
}
