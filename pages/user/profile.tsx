import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
export default function Profile({ sesh }: { sesh: CustomSession }) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchRecords = async () => {
    let id = sesh?.id;
    const res = await fetch("/api/records/get_record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setRecord(data.data);
      setLoading(false);
    } else {
      setError(true);
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
  useEffect(() => {
    fetchRecords();
  }, []);
  return (
    <div className="ml-48 2xl:ml-56 pt-20 py-5">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-primary pb-2 border-b">
          Resident's Profile
        </h1>
        <div className="container mt-5">
          <div className="container gap-5 py-16 px-10 bg-white rounded-xl shadow-lg">
            {record ? (
              <>
                <div className="flex flex-col md:gap-1 items-center md:flex-row h-full md:h-72">
                  <div className=" md:w-1/5 h-full p-5">
                    <img
                      className="w-full rounded-md aspect-square object-cover"
                      src={record?.image}
                      alt={record?.firstName + record?.lastName}
                    />
                  </div>
                  <div className="flex flex-col  gap-12 w-full md:w-4/5 border-l border-l-gray-300 h-full p-10  items-center">
                    <div className="flex flex-col md:flex-row justify-start gap-36 border-b border-b-gray-300 pb-5 w-full">
                      <div className="">
                        <h1 className="font-Poppins font-normal text-sm">
                          First Name:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {record?.firstName}
                        </h1>
                      </div>
                      <div className="">
                        <h1 className="font-Poppins font-normal text-sm">
                          Middle Name:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {record?.middleName}
                        </h1>
                      </div>
                      <div className="">
                        <h1 className="font-Poppins font-normal text-sm">
                          Last Name:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {record?.lastName}
                        </h1>
                      </div>
                      <div className="">
                        <h1 className="font-Poppins font-normal text-sm">
                          Suffix:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {record?.suffix}
                        </h1>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-start gap-36 border-b border-b-gray-300 pb-5 w-full">
                      <div>
                        <h1 className="font-Poppins font-normal text-sm">
                          Gender:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {record?.gender}
                        </h1>
                      </div>
                      <div className="">
                        <h1 className="font-Poppins font-normal text-sm">
                          Birthdate:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {returnDate(record?.birthDate)}
                        </h1>
                      </div>
                      <div className="">
                        <h1 className="font-Poppins font-normal text-sm">
                          Civil Status:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {record?.civilStatus}
                        </h1>
                      </div>
                      <div className="">
                        <h1 className="font-Poppins font-normal text-sm">
                          Occupation:
                        </h1>
                        <h1 className="font-Poppins font-semibold text-lg ">
                          {record?.occupation}
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
        {record && (
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
                    {record.addressLine1}
                  </h1>
                </div>
                <div>
                  <h1 className="font-Poppins font-normal text-sm">Barangay</h1>
                  <h1 className="font-Poppins font-semibold text-lg ">
                    {record.barangay}
                  </h1>
                </div>

                <div>
                  <h1 className="font-Poppins font-normal text-sm">City:</h1>
                  <h1 className="font-Poppins font-semibold text-lg ">
                    {record.city}
                  </h1>
                </div>
                <div>
                  <h1 className="font-Poppins font-normal text-sm">
                    Province:
                  </h1>
                  <h1 className="font-Poppins font-semibold text-lg ">
                    {record.province}
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
                    {record.email}
                  </h1>
                </div>
                <div>
                  <h1 className="font-Poppins font-normal text-sm">
                    Contact Number:
                  </h1>
                  <h1 className="font-Poppins font-semibold text-lg ">
                    {record.contactNumber}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        )}

        {record && (
          <div className="container mt-10">
            <div>
              <h1 className="text-2xl font-Poppins font-bold pb-5">
                Barangay Records
              </h1>
            </div>
            <div className="container gap-5 px-10 p-5 bg-white rounded-xl shadow-lg">
              {record.brgy_records == 0 ? (
                <div className="text-center">
                  <h1 className="font-Poppins text-2xl ">No records found</h1>
                </div>
              ) : (
                <>
                  {record.brgy_records.map((brgy: any) => (
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
    </div>
  );
}
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);
  const sesh = { ...session } as CustomSession;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      sesh,
    },
  };
}
