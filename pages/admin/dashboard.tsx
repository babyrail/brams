import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import { CustomSession } from "../api/auth/[...nextauth]";
import Link from "next/link";
export default function dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const [requests, setRequests] = useState([]);
  const fetchData = async () => {
    const res = await fetch("/api/user/get_users", {
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      setUserCount(json.users.length);
      setLoading(false);
    } else {
      setLoading(false);
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
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequest();
    fetchData();
  }, []);

  return (
    <div className="ml-48 2xl:ml-56 pt-20">
      <div className="container mx-auto ">
        <h2 className="font-SegoeUI font-bold text-2xl text-primary border-b">
          Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          <div className="bg-white shadow-md rounded-md p-5">
            <h3 className="font-SegoeUI font-bold text-xl">Total Users</h3>
            <h1 className="font-SegoeUI font-bold text-4xl">
              {!loading ? userCount : <ClipLoader color="#000000" size={20} />}
            </h1>
          </div>
          <div className="bg-white shadow-md rounded-md p-5">
            <div className="flex">
              <h3 className="font-SegoeUI font-bold text-xl">
                Documents Requested
              </h3>
              <Link href="/admin/pages/requests" className="text-xs grid place-items-center ml-2 bg-primary p-2 text-customWhite rounded-md hover:bg-highlight transition-all duration-100 ease-in">
                <span>
                  View Requests <i className="fa-solid fa-eye"></i>
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
  if (sesh.role != "superadmin") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return { props: { sesh } };
}
