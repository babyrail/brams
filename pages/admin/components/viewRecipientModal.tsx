import React from "react";

export default function ViewRecipientModal({
  setShowViewModal,
}: {
  setShowViewModal: any;
}) {
  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-full p-5 lg:p-0 flex justify-center   before:absolute before:top-0 before:left-0 before:bg-black before:opacity-30 before:w-screen before:h-full before:z-10">
        <div className="rounded-lg bg-white z-50 relative w-full lg:w-1/2 mx-auto pb-5 shadow-xl mt-10 h-fit"></div>
      </div>
    </div>
  );
}
