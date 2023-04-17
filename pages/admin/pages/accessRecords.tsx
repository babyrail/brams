import React from "react";
import { getSession } from "next-auth/react";
import { useState } from "react";

export default function accessRecords() {
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchMidName, setSearchMidName] = useState("");
  const [record, setRecord] = useState({ records: null } as { records: any });
  const handleOnSubmit = async (e: any) => {
    e.preventDefault();

    console.log(searchFirstName, searchLastName, searchMidName);

    const response = await fetch(
      `/api/records/?firstName=${searchFirstName.toUpperCase()}&lastName=${searchLastName.toUpperCase()}&middleName=${searchMidName.toUpperCase()}`
    );

    if (response.ok) {
      const data = await response.json();
      setRecord(data);
      console.log(record);
    }
  };
  const returnDate = (date: Date) => {
    const newDate = new Date(date);

    // Get day, month, and year from the date object
    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
    const year = newDate.getFullYear();

    // Format the date as "MM/DD/YYYY" string
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  };
  return (
    <div className="md:container mx-auto p-5 md:p-0">
      <div className="mt-20 border-b border-black pb-3">
        <h1 className="text-2xl font-Poppins font-bold text-customBlack">
          Search Records
        </h1>
      </div>
      <div id="searchForm" className="p-5 w-full md:w-1/2">
        <form
          action="POST"
          onSubmit={handleOnSubmit}
          className="flex flex-col gap-5 w-full p-0"
        >
          <div className=" flex flex-col md:flex-row md:justify-between md:items-center w-full">
            <label
              htmlFor="firstName"
              className="font-Poppins font-semibold text-lg"
            >
              First Name:
            </label>
            <input
              required
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              value={searchFirstName}
              onChange={(e) => setSearchFirstName(e.target.value)}
              className="p-2 md:w-96 font-Poppins border shadow-sm uppercase rounded-lg w-full"
            />
          </div>
          <div className=" flex flex-col md:flex-row md:justify-between md:items-center w-full">
            <label
              htmlFor="middleName"
              className="font-Poppins font-semibold text-lg"
            >
              Middle Name:
              <span className="text-sm font-normal text-gray-400 ml-1">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              name="middleName"
              id="middleName"
              placeholder="Middle Name"
              value={searchMidName}
              onChange={(e) => setSearchMidName(e.target.value)}
              className="p-2 md:w-96 font-Poppins border shadow-sm uppercase rounded-lg w-full"
            />
          </div>
          <div className=" flex flex-col md:flex-row md:justify-between md:items-center w-full">
            <label
              htmlFor="lastName"
              className="font-Poppins font-semibold text-lg"
            >
              Last Name:
            </label>
            <input
              required
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
              className="p-2 md:w-96 font-Poppins border shadow-sm uppercase rounded-lg w-full"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-500 w-full md:w-fit p-2 rounded-lg font-Poppins text-customWhite "
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="container">
        <h1 className="text-2xl font-bold text-customBlack pb-5">
          Resident's Profile
        </h1>
        <div className="container gap-5 py-16 px-10 bg-white rounded-xl shadow-lg">
          {record?.records ? (
            <>
              <div className="flex flex-col md:gap-1 items-center md:flex-row h-full md:h-72">
                <div className=" md:w-1/5 h-full p-5">
                  <img
                    className="w-full rounded-md aspect-square object-cover"
                    src={record?.records?.image}
                    alt={record?.records?.firstName + record?.records?.lastName}
                  />
                </div>
                <div className="flex flex-col  gap-12 w-full md:w-4/5 border-l border-l-gray-300 h-full p-10  items-center">
                  <div className="flex flex-col md:flex-row justify-start gap-36 border-b border-b-gray-300 pb-5 w-full">
                    <div className="">
                      <h1 className="font-Poppins font-normal text-sm">
                        First Name:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {record?.records?.firstName}
                      </h1>
                    </div>
                    <div className="">
                      <h1 className="font-Poppins font-normal text-sm">
                        Middle Name:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {record?.records?.middleName}
                      </h1>
                    </div>
                    <div className="">
                      <h1 className="font-Poppins font-normal text-sm">
                        Last Name:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {record?.records?.lastName}
                      </h1>
                    </div>
                    <div className="">
                      <h1 className="font-Poppins font-normal text-sm">
                        Suffix:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {record?.records?.suffix}
                      </h1>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-start gap-36 border-b border-b-gray-300 pb-5 w-full">
                    <div>
                      <h1 className="font-Poppins font-normal text-sm">
                        Gender:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {record?.records?.gender}
                      </h1>
                    </div>
                    <div className="">
                      <h1 className="font-Poppins font-normal text-sm">
                        Birthdate:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {returnDate(record?.records?.birthDate)}
                      </h1>
                    </div>
                    <div className="">
                      <h1 className="font-Poppins font-normal text-sm">
                        Civil Status:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {record?.records?.civilStatus}
                      </h1>
                    </div>
                    <div className="">
                      <h1 className="font-Poppins font-normal text-sm">
                        Occupation:
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {record?.records?.occupation}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">
              <h1 className="text-3xl font-Poppins text-center">
                No Records Found
              </h1>
            </div>
          )}
        </div>
      </div>
      {record?.records && (
        <div className="container mt-10">
          <div>
            <h1 className="text-2xl font-Poppins font-bold pb-5">
              Address & Contact Information
            </h1>
          </div>
          <div className="container gap-5 px-10 p-5 bg-white rounded-xl shadow-lg">
            <h1 className="font-Poppins font-semibold text-2xl pb-2 mb-2 border-b border-b-gray-300 ">
              Address:
            </h1>
            <div className="flex flex-col md:flex-row w-full gap-36 pt-5 pb-2 border-b border-b-gray-300">
              <div>
                <h1 className="font-Poppins font-normal text-sm">
                  Address Line:
                </h1>
                <h1 className="font-Poppins font-semibold text-lg ">
                  {record.records.addressLine1}
                </h1>
              </div>
              <div>
                <h1 className="font-Poppins font-normal text-sm">Barangay</h1>
                <h1 className="font-Poppins font-semibold text-lg ">
                  {record.records.barangay}
                </h1>
              </div>

              <div>
                <h1 className="font-Poppins font-normal text-sm">City:</h1>
                <h1 className="font-Poppins font-semibold text-lg ">
                  {record.records.city}
                </h1>
              </div>
              <div>
                <h1 className="font-Poppins font-normal text-sm">Province:</h1>
                <h1 className="font-Poppins font-semibold text-lg ">
                  {record.records.province}
                </h1>
              </div>
            </div>
            <h1 className="font-Poppins font-semibold text-2xl pb-2 mb-2 border-b border-b-gray-300 mt-10 ">
              Contact Details:
            </h1>
            <div className="flex flex-col md:flex-row w-full gap-36 pt-5 pb-2 ">
              <div>
                <h1 className="font-Poppins font-normal text-sm">Email:</h1>
                <h1 className="font-Poppins font-semibold text-lg ">
                  {record.records.email}
                </h1>
              </div>
              <div>
                <h1 className="font-Poppins font-normal text-sm">
                  Contact Number:
                </h1>
                <h1 className="font-Poppins font-semibold text-lg ">
                  {record.records.contactNumber}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}

      {record?.records && (
        <div className="container mt-10">
          <div>
            <h1 className="text-2xl font-Poppins font-bold pb-5">
              Barangay Records
            </h1>
          </div>
          <div className="container gap-5 px-10 p-5 bg-white rounded-xl shadow-lg">
            {record.records.brgy_records == 0 ? (
              <div className="text-center">
                <h1 className="font-Poppins text-2xl ">No records found</h1>
              </div>
            ) : (
              <>
                {record.records.brgy_records.map((brgy: any) => (
                  <div className="flex flex-col md:flex-row w-full gap-36 pt-5 pb-2 border-b border-b-gray-300">
                    <div>
                      <h1 className="font-Poppins font-normal text-sm">
                        records
                      </h1>
                      <h1 className="font-Poppins font-semibold text-lg ">
                        {brgy}
                      </h1>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return { props: { ...session } };
  }
}
