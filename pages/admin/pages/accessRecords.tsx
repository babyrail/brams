import React from "react";
import Records from "../../../models/BrgyRecords";
import dbConnect from "../../../lib/dbConnect";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
export default function accessRecords() {
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchMidName, setSearchMidName] = useState("");
  const [record, setRecord] = useState(null);
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    console.log(searchFirstName, searchLastName, searchMidName);

    // const form = new FormData(e.target);

    // const response = await fetch(
    //   `/api/records/?firstName=${searchFirstName.toUpperCase()}&lastName=${searchLastName.toUpperCase()}`
    // );
    // if (!response.ok) {
    //   console.log("error");
    // }
    // if (response.ok) {
    //   const data = await response.json();
    //   setRecord(data);
    // }

    console.log(record);
  };

  return (
    <div className="container mx-auto">
      <div className="mt-20 border-b border-black pb-3">
        <h1 className="text-2xl font-Poppins font-bold text-customBlack">
          Search Records
        </h1>
      </div>
      <div id="searchForm" className="">
        <form action="POST" onSubmit={handleOnSubmit}>
          <div className=" flex justify-between items-center w-1/2 p-1">
            <label
              htmlFor="firstName"
              className="font-Poppins font-semibold text-lg"
            >
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              value={searchFirstName}
              onChange={(e) => setSearchFirstName(e.target.value)}
              className="p-2 w-96 border shadow-sm rounded-lg"
            />
          </div>
          <div className=" flex justify-between items-center w-1/2 p-1">
            <label
              htmlFor="middleName"
              className="font-Poppins font-semibold text-lg"
            >
              Middle Name:
            </label>
            <input
              type="text"
              name="middleName"
              id="middleName"
              placeholder="Middle Name"
              value={searchMidName}
              onChange={(e) => setSearchMidName(e.target.value)}
              className="p-2 w-96 border shadow-sm rounded-lg"
            />
          </div>
          <div className=" flex justify-between items-center w-1/2 p-1">
            <label
              htmlFor="lastName"
              className="font-Poppins font-semibold text-lg"
            >
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
              className="p-2 w-96 border shadow-sm rounded-lg"
            />
          </div>

          <button type="submit">Search</button>
        </form>
        {record && (
          <div>
            {record?.records?.image && (
              <img className="w-1/2" src={record?.records?.image} alt="image" />
            )}
            <h1>{record?.records?.firstName}</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
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
