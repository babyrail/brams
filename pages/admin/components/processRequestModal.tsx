import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { generate, Template } from "@pdfme/generator";
import clearance from "../../../templates/clearance.json";
import indigency from "../../../templates/indigency.json";
import DataTable, { TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSession } from "next-auth/react";
import { CustomSession } from "../../../pages/api/auth/[...nextauth]";
const MySwal = withReactContent(Swal);

type Row = {
  Type: string;
  Action: JSX.Element;
};

export default function ProcessRequestModal({
  requestID,
  setShowViewModal,
  fetchRequests,
}: {
  requestID: string;
  setShowViewModal: any;
  fetchRequests: any;
}) {
  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };

  const sesh = { ...session } as CustomSession;
  const swalFireSuccess = (message?: string) => {
    MySwal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonText: "Ok",
    });
  };
  const swalFireWarning = (message: string) => {
    MySwal.fire({
      title: "Warning!",
      text: message,
      icon: "warning",
      confirmButtonText: "Ok",
    });
  };
  const [requestData, setRequestData] = useState<any>({});
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const [tableData, setTableData] = useState<any>([]);
  const regex = /pending/i;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Augusst",
    "September",
    "October",
    "November",
    "December",
  ];
  const getData = async () => {
    const res = await fetch(`/api/requests/get_request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: requestID,
      }),
    });
    const response = await res.json();
    if (response.error) {
      setError(true);
    } else {
      setRequestData(response.data);
      let data: any = [];
      response.data.request_type.forEach((element: string) => {
        data.push({ Type: element });
      });
      setTableData(data);
      const records = await fetch(`/api/records/get_record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: response.data.user_id,
        }),
      });
      const recordsResponse = await records.json();
      setUserData(recordsResponse.data);

      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [requestID]);
  const generateClearance = async () => {
    const currentDate = new Date();
    const template: Template = clearance as any;

    const inputs: any = [
      {
        fullName: requestData?.user_name,
        age: `${requestData?.user_age}`,
        currentDay: currentDate.getDate().toString(),
        currentMonth: monthNames[currentDate.getMonth()],
        signature: requestData?.user_name,
      },
    ];
    generate({ template, inputs }).then((pdf) => {
      //download the pdf
      const blob = new Blob([pdf.buffer], {
        type: "application/pdf",
      });
      window.open(URL.createObjectURL(blob));
    });
  };
  const generateIndigency = async () => {
    const currentDate = new Date();
    const template: Template = indigency as any;
    const inputs: any = [
      {
        fullName: requestData?.user_name,
        currentDay: currentDate.getDate().toString(),
        currentMonth: monthNames[currentDate.getMonth()],
      },
    ];
    generate({ template, inputs }).then((pdf) => {
      //download the pdf
      const blob = new Blob([pdf.buffer], {
        type: "application/pdf",
      });
      window.open(URL.createObjectURL(blob));
    });
  };
  const updatePaymentStatus = async () => {
    console.log(requestID);
    const res = await fetch(`/api/requests/confirm-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: requestID,
      }),
    });
    if (res.status == 201) {
      getData();
      swalFireSuccess("Payment has been confirmed");
      fetchRequests();
    } else {
      const response = await res.json();
      if (response.error) {
        swalFireWarning("Something went wrong");
      }
    }
  };
  const updateReadyPickup = async () => {
    if (requestData?.paymentStatus == "Pending") {
      swalFireWarning("Please confirm payment first");
      return;
    }
    const res = await fetch(`/api/requests/ready-to-pickup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: requestID,
      }),
    });
    if (res.status == 201) {
      swalFireSuccess("Documents are ready for pickup!");
      window.location.reload();
    } else {
      const response = await res.json();
      if (response.error) {
        swalFireWarning("Something went wrong");
      }
    }
  };
  const releaseDocument = async () => {
    if (requestData?.status == "Ready to Pickup") {
      const res = await fetch(`/api/requests/release-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestID,
          clerk_name: sesh?.name,
        }),
      });
      if (res.ok) {
        swalFireSuccess("Document has been released");
        window.location.reload();
      } else {
        const response = await res.json();
        if (response.error) {
          swalFireWarning("Something went wrong");
        }
      }
    } else {
      swalFireWarning("Please confirm if the document is ready for pickup");
    }
  };
  const columns: TableColumn<Row>[] = [
    {
      name: "Type",
      selector: (row) => row.Type,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: any) => (
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-highlight transition-all duration-200"
          data-id={row.Type}
          onClick={
            row.Type.toUpperCase() == "CLEARANCE"
              ? generateClearance
              : row.Type.toUpperCase() == "INDIGENCY"
              ? generateIndigency
              : () => {}
          }
        >
          Process
        </button>
      ),
    },
  ];
  return (
    <div className="h-full">
      <div className="absolute top-0 left-0 w-full h-full p-5 lg:p-0 flex justify-center   before:absolute before:top-0 before:left-0 before:bg-black before:opacity-30 before:w-screen before:h-full before:z-10">
        <div className="rounded-lg bg-white z-50 relative w-full lg:w-1/2 mx-auto pb-5 shadow-xl mt-10 h-fit">
          <div className="flex justify-between px-5 py-4 border-b items-center">
            <h1 className="font-SegoeUI font-semibold text-primary text-xl">
              Request Information
            </h1>
            <button
              className=" text-2xl "
              onClick={() => {
                setShowViewModal(false);
              }}
            >
              &times;
            </button>
          </div>
          <div className="flex justify-between px-5">
            <div>
              <h1 className="py-3 font-SegoeUI font-semibold">
                <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                  Name:
                </span>
                {requestData?.user_name}
              </h1>
              <h1 className="py-3 font-SegoeUI font-semibold">
                <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                  Address:
                </span>{" "}
                {userData?.addressLine1}
              </h1>
              <h1 className="py-3 font-SegoeUI font-semibold">
                <span className="font-SegoeUI font-bold font-lg text-black mr-2">
                  Gender:
                </span>{" "}
                {userData?.gender}
              </h1>
            </div>
            <div className="w-1/4">
              <img
                src={
                  userData?.image
                    ? userData?.image
                    : "https://res.cloudinary.com/dk3msiid1/image/upload/v1683644713/placeholder_hhvgb8.jpg"
                }
                alt="asdfasdf"
              />
            </div>
          </div>
          <div className="px-5">
            <h1 className="border-b py-2 font-SegoeUI font-semibold text-xl text-primary ">
              Barangay Records
            </h1>
            <div className="grid grid-cols-1">
              {userData?.brgy_records?.length > 0 ? (
                userData?.brgy_records?.map((record: any) => {
                  return (
                    <h1 className="py-3 font-SegoeUI font-semibold">
                      {record}
                    </h1>
                  );
                })
              ) : (
                <h1 className="mx-auto py-5">No Derogatory Record found</h1>
              )}
            </div>
          </div>
          <div className="px-5">
            <h1 className="font-SegoeUI font-semibold text-primary text-xl border-b py-2">
              Payment Status:{" "}
              {regex.test(requestData?.paymentStatus) ? (
                <span className="text-error">Pending</span>
              ) : (
                <span className="text-tertiary">Approved</span>
              )}
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-5">
              <div className="flex justify-between items-center py-3 bg-customWhite rounded-md p-5">
                <div className=" w-full">
                  <h1 className="font-SegoeUI font-semibold border-b ">
                    Request Summary
                  </h1>
                  <div className=" w-full">
                    {requestData?.request_type?.map((type: string) => {
                      return (
                        <div className="flex justify-between items-center">
                          <h1 className="font-SegoeUI font-semibold">{type}</h1>
                          {type.toUpperCase() == "CLEARANCE" ? (
                            <h1 className="font-SegoeUI font-semibold">
                              ₱ 50.00
                            </h1>
                          ) : type.toUpperCase() == "INDIGENCY" ? (
                            <h1 className="font-SegoeUI font-semibold">
                              ₱ 50.00
                            </h1>
                          ) : (
                            <h1 className="font-SegoeUI font-semibold">
                              ₱ 40.00
                            </h1>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t ">
                    <div className="flex justify-between items-center py-3">
                      <h1 className="font-SegoeUI font-semibold">Total</h1>
                      <h1 className="font-SegoeUI font-semibold">
                        ₱ {requestData?.price}.00
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" py-3 bg-customWhite rounded-md p-5">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h1 className="font-SegoeUI font-semibold border-b ">
                      Preferred Payment Method
                    </h1>
                    <div className=" w-full">
                      <h1 className="font-SegoeUI font-semibold">
                        {requestData?.paymentMethod}
                      </h1>
                    </div>
                  </div>
                  {requestData?.refNum != "N/A" ? (
                    <div className="flex justify-between items-center ">
                      <div>
                        <h1 className="font-SegoeUI font-semibold ">
                          Referrence Number
                        </h1>
                        <div className=" w-full">
                          <h1 className="font-SegoeUI font-semibold">
                            {requestData?.refNum}
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-primary text-white text-sm px-2 py-2 rounded float-right hover:bg-highlight transition-all duration-200"
                          onClick={updatePaymentStatus}
                        >
                          Confirm Payment
                        </button>
                        <button className="border-2 border-error text-error text-sm px-2 py-2 rounded float-right hover:bg-error hover:text-white transition-all duration-200 ease-in-out">
                          Payment Issue Report
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="bg-primary text-white text-sm px-2 py-2 rounded float-right hover:bg-highlight transition-all duration-200 w-fit"
                        onClick={updatePaymentStatus}
                      >
                        Confirm Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="px-5">
            <h1 className="font-SegoeUI font-semibold text-primary text-xl">
              Documents Requested
            </h1>
            <DataTable
              columns={columns}
              data={tableData}
              className="border border-gray-200  "
            />
          </div>
          <div className="px-5 mt-3 flex justify-end items-center gap-2">
            {requestData?.status == "Ready to Pickup" ? (
              <button
                className="bg-primary text-white text-sm px-2 py-2 rounded  hover:bg-highlight transition-all duration-200"
                onClick={releaseDocument}
              >
                Release Document <i className="fa-solid fa-check"></i>
              </button>
            ) : (
              <button
                className="bg-primary text-white text-sm px-2 py-2 rounded  hover:bg-highlight transition-all duration-200"
                onClick={updateReadyPickup}
              >
                Ready for Pickup <i className="fa-solid fa-check"></i>
              </button>
            )}
            <button
              className="outline outline-2 outline-error   text-error text-sm px-4 py-2 rounded  hover:bg-error hover:text-white transition-all duration-200 ease-in-out"
              onClick={() => {
                setShowViewModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
