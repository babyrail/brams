import React, { useMemo, useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { IRequest } from "../../../models/requestModels";
import { generate, Template } from "@pdfme/generator";
import clearance from "../../../templates/clearance.json";
import ProcessRequestModal from "../components/processRequestModal";
import { getSession } from "next-auth/react";
type Row = {
  Name: string;
  Purpose: string;
  DocumentType: string;
  Date: string;
  Status: string;
  Action: JSX.Element;
  selector: any;
};

export default function requests() {
  const [data, setData] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [requestID, setRequestID] = useState("");
  const [tableData, setTableData] = useState<Row[]>([]);
  const clearFilter = () => {
    setTableData(data);
    const filter = document.getElementById("filter") as HTMLInputElement;
    filter.value = "";
  };

  const filterTable = (e: any) => {
    const value = e.target.value.toLowerCase();
    const filteredData = data.filter((row: any) => {
      return (
        row.user_name.toLowerCase().includes(value) ||
        row.purpose.toLowerCase().includes(value) ||
        row.status.toLowerCase().includes(value)
      );
    });
    setTableData(filteredData);
  };
  const fetchRequests = async () => {
    const response = await fetch("/api/requests/get_requests");
    const requests = await response.json();
    setData(requests.data);
    setTableData(requests.data);
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  const customStyles = {
    rows: {
      style: {
        minHeight: "50px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#4A68C4",
        color: "#fff",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };
  const download = async (fullName: string, age: number) => {
    const template: Template = clearance as any;
    //get age from the birthday
    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const inputs: any = [
      {
        fullName: fullName,
        age: `${age}`,
        currentDay: currentDate.getDate().toString(),
        currentMonth: monthNames[currentDate.getMonth()],
        signature: fullName,
      },
    ];
    generate({ template, inputs }).then((pdf) => {
      //download the pdf
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    });
  };

  const columns: TableColumn<Row>[] = [
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
    {
      name: "Action",
      cell: (row: any) => (
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-highlight transition-all duration-200"
          data-id={row.user_name}
          onClick={() => {
            setRequestID(row._id);
            setShowViewModal(true);
          }}
        >
          Process
        </button>
      ),
    },
  ];

  const paginationComponentOptions = {
    noRowsPerPage: true,
    rowsPerPageText: "Rows per page",
  };
  return (
    <div>
      <div className="ml-48 2xl:ml-56 pt-20 h-[120vh]">
        <div className="container mx-auto">
          <h1 className="text-2xl text-primary font-SegoeUI font-bold border-b pb-4">
            Document Requests
          </h1>
        </div>
        <div className="container mx-auto">
          <div className="float-right flex py-3">
            <input
              type="text"
              title="filter"
              placeholder="Search"
              id="filter"
              className="  border border-gray-300 rounded-md py-2 px-3  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={filterTable}
            />
            <button
              type="button"
              title="Clear Filter"
              onClick={clearFilter}
              className="bg-primary text-customWhite rounded-md w-10 my-1 aspect-square ml-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-highlight transition-all duration-200"
            >
              &times;
            </button>
          </div>
          <DataTable
            columns={columns}
            data={tableData}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            customStyles={customStyles}
          />
        </div>
      </div>
      {showViewModal && (
        <ProcessRequestModal
          requestID={requestID}
          setShowViewModal={setShowViewModal}
          fetchRequests={fetchRequests}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const sesh = { ...session };
  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  return {
    props: { sesh },
  };
}
