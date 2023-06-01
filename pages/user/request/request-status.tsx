import React, { useState, useEffect } from "react";
import { IRequest } from "../../../models/requestModels";

import { IRecentTrans } from "../../../models/recentTransactionModel";
import { useSession, getSession } from "next-auth/react";
import { CustomSession } from "../../../pages/api/auth/[...nextauth]";
import DataTable, { TableColumn } from "react-data-table-component";
export default function RequestStatus({ sesh }: { sesh: CustomSession }) {
  const [currentRequest, setCurrentRequest] = useState([] as IRequest[]);
  const [recentRequest, setRecentRequest] = useState([] as IRecentTrans[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchRequests = async () => {
    let id = sesh?.id;
    const res = await fetch("/api/requests/get_requests", {
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
      setCurrentRequest(data.data);
      setLoading(false);
    } else {
      setError(true);
    }
  };
  const fetchRecentTrans = async () => {
    let id = sesh?.id;
    const res = await fetch("/api/requests/get-recent-transactions", {
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
      setRecentRequest(data.data);
      setLoading(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    fetchRecentTrans();
    fetchRequests();
  }, []);
  const customStyles = {
    rows: {
      style: {
        minWidth: "100px ", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#4A68C4",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "1rem",
      },
    },
    cells: {
      style: {
        fontSize: "0.9rem",
      },
    },
  };
  const activeRequestColumn: TableColumn<any>[] = [
    {
      name: "Name",
      selector: (row: any) => {
        return row.user_name;
      },
    },
    {
      name: "Purpose",
      selector: (row: any) => {
        return row.purpose;
      },
    },
    {
      name: "Requested Documents",
      selector: (row: any) => {
        return row.request_type;
      },
    },
    {
      name: "Date Requested",
      selector: (row: any) => {
        return new Date(row.request_date).toLocaleDateString();
      },
    },
    {
      name: "Status",
      selector: (row: any) => {
        return row.status;
      },
    },
  ];
  const recentRequestColumn: TableColumn<any>[] = [
    {
      name: "Name",
      selector: (row: any) => {
        return row.user_name;
      },
    },
    {
      name: "Purpose",
      selector: (row: any) => {
        return row.purpose;
      },
    },
    {
      name: "Requested Documents",
      selector: (row: any) => {
        return row.request_type;
      },
    },
    {
      name: "Date Requested",
      selector: (row: any) => {
        return new Date(row.request_date).toLocaleDateString();
      },
    },
    {
      name: "Release Date",
      selector: (row: any) => {
        return new Date(row.release_date).toLocaleDateString();
      },
    },
  ];
  return (
    <div className="ml-48 2xl:ml-56 pt-20 py-5">
      <div className="container mx-auto">
        <h1 className="text-2xl font-SegoeUI text-primary font-bold border-b py-2">
          Request Status
        </h1>

        <div>
          <h1 className="text-xl font-SegoeUI text-primary font-bold border-b py-2">
            Active Requests
          </h1>
          <DataTable
            columns={activeRequestColumn}
            data={currentRequest}
            progressPending={loading}
            customStyles={customStyles}
          />
        </div>
        <div>
          <h1 className="text-xl font-SegoeUI text-primary font-bold border-b py-2">
            Recent Transactions
          </h1>
          <DataTable
            columns={recentRequestColumn}
            data={recentRequest}
            progressPending={loading}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
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
