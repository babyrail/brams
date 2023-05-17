import React, { useState, useEffect } from "react";

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
  }, []);

  return (
    <div className="ml-56 pt-20">
      <div className="container mx-auto ">
        <h2 className="font-SegoeUI font-bold text-2xl text-primary border-b">
          Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          <div className="bg-white shadow-md rounded-md p-5">
            <h3 className="font-SegoeUI font-bold text-xl">Total Users</h3>
            <h1 className="font-SegoeUI font-bold text-4xl">{userCount}</h1>
          </div>
          <div className="bg-white shadow-md rounded-md p-5">
            <h3 className="font-SegoeUI font-bold text-xl">
              Documents Requested
            </h3>
            <h1 className="font-SegoeUI font-bold text-4xl">{requestCount}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
