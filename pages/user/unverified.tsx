import React from "react";

export default function Unverified() {
  return (
    <div className="bg-customWhite h-[90vh]">
      <div className="p-20">
        <h1 className="text-3xl font-bold text-center">
          Your account is not verified yet
        </h1>
        <p className="text-center">
          We sent a verifcation code in your registerd mobile number.
        </p>
      </div>
    </div>
  );
}
