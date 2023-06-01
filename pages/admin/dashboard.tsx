import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import { CustomSession } from "../api/auth/[...nextauth]";
import Link from "next/link";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { IRecord } from "../../models/BrgyRecords";
import DataTable, { TableColumn } from "react-data-table-component";
type Row = {
  Name: string;
  Purpose: string;
  DocumentType: string;
  Date: string;
  ClerkAssigned: string;
};
export default function dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const [totalHousehold, setTotalHousehold] = useState(0);
  const [totalFemale, setTotalFemale] = useState(0);
  const [totalMale, setTotalMale] = useState(0);
  const [requests, setRequests] = useState([]);
  const [totalPop, setTotalPop] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([] as Row[]);
  const fetchData = async () => {
    const res = await fetch("/api/user/get_users", {
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      setUserCount(json.users.length);
    } else {
    }
  };
  ChartJS.register(ArcElement, Tooltip, Legend);
  const fetchPopulation = async () => {
    const res = await fetch("/api/records/get_records", {
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      setTotalPop(json.records.length);
      let female = 0;
      let male = 0;
      json.records.forEach((record: IRecord) => {
        if (record?.gender == "MALE") {
          male++;
        } else {
          female++;
        }
      });
      setTotalFemale(female);
      setTotalMale(male);
    }
  };
  const fetchRecentTransactions = async () => {
    const res = await fetch("/api/requests/get-recent-transactions", {
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      setRecentTransactions(json.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const fetchHousehold = async () => {
    const res = await fetch("/api/household/get_households", {
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      setTotalHousehold(json.households.length);
    }
    if (!res.ok) {
    }
  };
  const fetchRequest = async () => {
    setLoading(true);
    const res = await fetch("/api/requests/get_requests", {
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      setRequestCount(json.data.length);
      setRequests(json.data);
    }
  };
  useEffect(() => {
    fetchRequest();
    fetchData();
    fetchPopulation();
    fetchHousehold();
    fetchRecentTransactions();
  }, []);
  const columns: TableColumn<Row>[] = [
    {
      name: "Name",
      selector: (row: any) => {
        return row.user_name;
      },
    },

    {
      name: "Document Type",
      selector: (row: any) => {
        return row.request_type + " ";
      },
    },
    {
      name: "Date",
      selector: (row: any) => {
        return new Date(row.release_date).toLocaleDateString();
      },
      width: "120px",
    },
    {
      name: "Clerk Assigned",
      selector: (row: any) => {
        return row.clerk_name;
      },
      width: "120px",
    },
  ];
  return (
    <div className="ml-48 2xl:ml-56 pt-20">
      <div className="container mx-auto ">
        <h2 className="font-SegoeUI font-bold text-2xl text-primary border-b">
          Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          <div className="bg-white shadow-md rounded-md p-5 flex justify-between items-center">
            <div>
              <h3 className="text-customBlack font-SegoeUI font-bold text-xl">
                Total Household
              </h3>
              <h1 className="font-SegoeUI font-bold text-4xl">
                {!loading ? (
                  totalHousehold
                ) : (
                  <ClipLoader color="#000000" size={20} />
                )}
              </h1>
            </div>
            <div>
              <i className="text-primary fa-solid fa-house text-5xl"></i>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md p-5 flex justify-between items-center">
            <div>
              <h3 className="text-customBlack font-SegoeUI font-bold text-xl">
                Total Users
              </h3>
              <h1 className="font-SegoeUI font-bold text-4xl">
                {!loading ? (
                  userCount
                ) : (
                  <ClipLoader color="#000000" size={20} />
                )}
              </h1>
            </div>
            <div>
              <i className="text-primary fa-solid fa-user text-5xl"></i>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md p-5 flex justify-between items-center">
            <div>
              <div className="flex">
                <h3 className="text-customBlack font-SegoeUI font-bold text-xl">
                  Documents Requested
                </h3>
                <Link
                  href="/admin/pages/requests"
                  className="text-xs grid place-items-center ml-2 bg-primary p-2 text-customWhite rounded-md hover:bg-highlight transition-all duration-100 ease-in"
                >
                  <span>
                    View Requests <i className=" fa-solid fa-eye"></i>
                  </span>
                </Link>
              </div>
              <h1 className="font-SegoeUI font-bold text-4xl">
                {!loading ? (
                  requestCount
                ) : (
                  <ClipLoader color="#000000" size={20} />
                )}
              </h1>
            </div>
            <div>
              <i className="text-primary fa-solid fa-file text-5xl"></i>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="bg-white shadow-md rounded-md p-5 ">
            <h3 className="text-customBlack font-SegoeUI font-bold text-xl border-b pb-2">
              Demography
            </h3>
            <div className="flex justify-between items-center mt-2">
              <div>
                <h1 className="font-SegoeUI font-bold text-lg">
                  Total Population
                </h1>
                <h1 className="font-SegoeUI font-bold text-4xl">
                  {!loading ? (
                    totalPop
                  ) : (
                    <ClipLoader color="#000000" size={20} />
                  )}
                </h1>
                <div className="flex justify-between items-center mt-5">
                  <div className="text-primary flex flex-col justify-center items-center w-20 ">
                    <i className="fa-solid fa-male text-6xl "></i>
                    <h1 className="font-SegoeUI font-bold text-lg">Male</h1>
                  </div>
                  <h1 className="font-SegoeUI font-bold text-4xl ">
                    {!loading ? (
                      totalMale
                    ) : (
                      <ClipLoader color="#000000" size={20} />
                    )}
                  </h1>
                </div>
                <div className="flex justify-between items-center">
                  <div className=" text-pink-600 flex flex-col justify-center items-center w-20 ">
                    <i className="fa-solid fa-female text-6xl"> </i>
                    <h1 className="font-SegoeUI font-bold text-lg">Female</h1>
                  </div>
                  <h1 className="font-SegoeUI font-bold text-4xl ">
                    {!loading ? (
                      totalFemale
                    ) : (
                      <ClipLoader color="#000000" size={20} />
                    )}
                  </h1>
                </div>
              </div>
              <div>
                <Pie
                  data={{
                    labels: ["Male", "Female"],
                    datasets: [
                      {
                        label: "Population",
                        data: [totalMale, totalFemale],
                        backgroundColor: ["#3B82F6", "#F472B6"],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md p-5 ">
            <h3 className="text-customBlack font-SegoeUI font-bold text-xl border-b pb-2">
              Recent Transactions
            </h3>
            <div className="mt-5">
              <DataTable
                columns={columns}
                data={recentTransactions}
                responsive
                progressPending={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const sesh = { ...session } as CustomSession;
  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return { props: { sesh } };
}
