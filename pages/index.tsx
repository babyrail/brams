import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import Records from "../models/BrgyRecords";
import { signOut, getSession } from "next-auth/react";
import React from "react";

export default function Index({ records, ...session }) {
  return (
    <>
      <div>
        <h1>{session.role}</h1>
        <h1 className="text-3xl font-bold underline">Records</h1>
        <ul>
          {records?.map((record) => (
            <li key={record._id}>
              <Link href="/records/[id]" as={`/records/${record._id}`}>
                {record.firstName}
              </Link>
              <p>{record.lastName}</p>

              <br></br>
              <img
                src={record.image}
                alt={record.firstName}
                width="200px"
              ></img>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            signOut({ redirect: true }).then(() => {
              window.location.href = "/login";
            });
          }}
          className="absolute top-0 right-0 w-1/5 bg-[#1D1D1F] text-white font-Poppins font-semibold text-lg h-14 rounded-[3px] hover:bg-[#2D2D2F] transition-colors duration-300 shadow-2xl"
        >
          Logout
        </button>
      </div>
    </>
  );
}

/* Retrieves pet(s) data from mongodb database */
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
    await dbConnect();
    const result = await Records.find({});
    const records = result.map((doc) => {
      const record = doc.toObject();
      record._id = record._id.toString();
      return record;
    });
    return { props: { records: records, ...session } };
  }
}
