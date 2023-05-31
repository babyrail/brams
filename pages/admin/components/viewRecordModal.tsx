import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
export default function ViewRecordModal({
  recordID,
  setShowViewModal,
}: {
  recordID: string;
  setShowViewModal: any;
}) {
  const [record, setRecord] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`/api/records/get_record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: recordID,
        }),
      });
      const response = await res.json();
      if (response.error) {
        setError(true);
      } else {
        setRecord(response.data);
        setLoading(false);
      }
    };
    getData();
  }, [recordID]);

  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-screen p-5 lg:p-0 flex justify-center items-center  before:absolute before:top-0 before:left-0 before:bg-black before:opacity-30 before:w-screen before:h-full before:z-10">
        <div className="rounded-lg bg-white z-50 relative w-full lg:w-1/2 mx-auto py-14 px-10  shadow-xl">
          <button
            className="absolute top-0 right-5 text-3xl"
            onClick={() => {
              setShowViewModal(false);
            }}
          >
            &times;
          </button>
          <div className="flex justify-between">
            <div>
              <h1 className="py-3 font-SegoeUI font-semibold">
                <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                  Name:
                </span>
                {record?.firstName +
                  " " +
                  record?.middleName +
                  " " +
                  record?.lastName}
              </h1>
              <h1 className="py-3 font-SegoeUI font-semibold">
                <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                  Address:
                </span>{" "}
                {record?.addressLine1}
              </h1>
              <h1 className="py-3 font-SegoeUI font-semibold">
                <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                  Gender:
                </span>{" "}
                {record?.gender}
              </h1>
            </div>
            <div className="w-1/4">
              <img
                src={
                  record?.image
                    ? record?.image
                    : "https://res.cloudinary.com/dk3msiid1/image/upload/v1683644713/placeholder_hhvgb8.jpg"
                }
                alt="asdfasdf"
              />
            </div>
          </div>
          <div>
            {router.pathname == "/admin/pages/manageRecords" && (
              <div>
                <h1 className="border-b py-2 font-SegoeUI font-bold text-xl text-primary ">
                  Personal Information
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 ">
                  <h1 className="py-3 font-SegoeUI font-semibold">
                    <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                      Birth Date:
                    </span>{" "}
                    {new Date(record?.birthDate).toLocaleDateString()}
                  </h1>
                  <h1 className="py-3 font-SegoeUI font-semibold">
                    <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                      Civil Status:
                    </span>{" "}
                    {record?.civilStatus}
                  </h1>
                  <h1 className="py-3 font-SegoeUI font-semibold">
                    <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                      Occupation:
                    </span>{" "}
                    {record?.occupation ? record?.occupation : "N/A"}
                  </h1>
                  <h1 className="py-3 font-SegoeUI font-semibold">
                    <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                      Family Head:
                    </span>{" "}
                    {record?.familyHead ? record?.familyHead : "N/A"}
                  </h1>
                </div>
                <h1 className="border-b py-2 font-SegoeUI font-bold text-xl text-primary ">
                  Contact Information
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 ">
                  <h1 className="py-3 font-SegoeUI font-semibold">
                    <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                      Mobile Number:
                    </span>{" "}
                    {record?.contactNumber}
                  </h1>
                  <h1 className="py-3 font-SegoeUI font-semibold">
                    <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                      Email:
                    </span>{" "}
                    {record?.email}
                  </h1>
                  <h1 className="py-3 font-SegoeUI font-semibold">
                    <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                      Full Address:
                    </span>
                    {record?.addressLine1 +
                      " " +
                      (record?.addressLine2 || "") +
                      " " +
                      record?.barangay +
                      " " +
                      record?.city +
                      ", " +
                      record?.province}
                  </h1>
                </div>
              </div>
            )}
            <h1 className="border-b py-2 font-SegoeUI font-bold text-xl text-primary ">
              Barangay Records
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 ">
              {record?.brgy_records?.map((record: any) => {
                return (
                  <h1 className="py-3 font-SegoeUI font-semibold">{record}</h1>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
