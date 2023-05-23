import React, { useMemo, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { IRequest } from "../../../models/requestModels";

interface Row {}
export default function requests() {
  const [data, setData] = useState([] as IRequest[]);
  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch(
        "http://localhost:3000/api/requests/get_requests"
      );
      const requests = await response.json();
      setData(requests.data);
    };
    fetchRequests();
  }, []);
  const columns = [
    {
      name: "Name",
      selector: (row: any) => row.user_name,
      sortable: true,
    },
    {
      name: "Purpose",
      selector: (row: any) => row.purpose,
      sortable: true,
    },
    {
      name: "Document Type",
      selector: (row: any) => row.request_type + "",
    },
    {
      name: "Date",
      selector: (row: any) =>
        new Date(row.request_date).toISOString().slice(0, 10),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      sortable: true,
    },
  ];
  return (
    <div className="ml-48 2xl:ml-56 mt-12   ">
      <div className="container mx-auto">
        <h1 className="text-2xl text-primary font-SegoeUI font-bold border-b pb-4">
          Document Requests
        </h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
