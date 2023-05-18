import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function requestDocument() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const handleSelection = (e: any) => {
    const target = e.target.getAttribute("data-target");
    e.target.classList.toggle("bg-primary");
    e.target.classList.toggle("text-customWhite");
    const checkbox = document.querySelector(`#${target}`);
    checkbox?.toggleAttribute("checked");
  };
  return (
    <div className="ml-48 2xl:ml-56 pt-20 py-5">
      <div className="container mx-auto">
        <h2 className="font-SegoeUI font-bold text-2xl text-primary border-b pb-5 ">
          Documents Request Form
        </h2>
        <div>
          <form action="POST" className="w-3/4 mx-auto">
            <div className="bg-white shadow-md rounded-md p-5 mt-5 flex flex-col gap-5">
              <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Resident's Name
                </h1>
                <div className="flex gap-5 flex-col md:flex-row mt-5 md:mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    className="border bg-gray-100 rounded-md p-2 w-full"
                  />
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    placeholder="Middle Name"
                    className="border bg-gray-100 rounded-md p-2 w-full"
                  />
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    className="border bg-gray-100 rounded-md p-2 w-full"
                  />
                </div>
              </div>
              <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Pick Up Date
                </h1>
                <DatePicker
                  selected={date}
                  onChange={(newDate: Date) => setDate(newDate)}
                  className="border bg-gray-100 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Purpose
                </h1>
                <textarea
                  name="purpose"
                  id="purpose"
                  placeholder="Purpose"
                  className="border bg-gray-100 rounded-md p-2 w-full resize-none h-20"
                />
              </div>
              <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Document Type
                </h1>
                <div className="grid grid-cols-3 justify-center items-center place-items-center gap-3">
                  <div className="w-full">
                    <input
                      title="Brgy. Clearance"
                      type="checkbox"
                      name="clearance"
                      id="clearance"
                      className="mr-2"
                      hidden
                    />
                    <div
                      className="flex justify-center items-center bg-customWhite py-4 cursor-pointer rounded-md"
                      data-target="clearance"
                      onClick={handleSelection}
                    >
                      <i className="fa-solid fa-file text-md 2xl:text-md  group-hover:text-customWhite "></i>
                      <h1 className="font-Poppins font-bold text-md 2xl:text-md ml-5  group-hover:text-customWhite  ">
                        Brgy. Clearance
                      </h1>
                    </div>
                  </div>
                  <div className="w-full">
                    <input
                      title="Indigency"
                      type="checkbox"
                      name="indigency"
                      id="indigency"
                      className="mr-2"
                      hidden
                    />
                    <div
                      className="flex justify-center items-center bg-customWhite py-4 cursor-pointer rounded-md  "
                      data-target="indigency"
                      onClick={handleSelection}
                    >
                      <i className="fa-solid fa-file text-md 2xl:text-md  group-hover:text-customWhite "></i>
                      <h1 className="font-Poppins font-bold text-md 2xl:text-md ml-5  group-hover:text-customWhite  ">
                        Brgy. Indigency
                      </h1>
                    </div>
                  </div>
                  <div className="w-full">
                    <input
                      title="Cedula"
                      type="checkbox"
                      name="cedula"
                      id="cedula"
                      className="mr-2"
                      hidden
                    />
                    <div
                      className="flex justify-center items-center bg-customWhite py-4 cursor-pointer rounded-md  "
                      data-target="cedula"
                      onClick={handleSelection}
                    >
                      <i className="fa-solid fa-file text-md 2xl:text-md  group-hover:text-customWhite "></i>
                      <h1 className="font-Poppins font-bold text-md 2xl:text-md ml-5  group-hover:text-customWhite  ">
                        Cedula
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button
                  className="bg-primary font-SegoeUI font-bold text-customWhite px-5 py-2 rounded-md hover:bg-highlight transition-all duration-100 ease-in  "
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
