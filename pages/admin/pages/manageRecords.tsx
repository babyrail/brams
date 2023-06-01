import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { IRecord } from "../../../models/BrgyRecords";
import CreateRecord from "./createRecord";
import ViewRecordModal from "../components/viewRecordModal";
import DataTable, { TableColumn } from "react-data-table-component";
export default function manageRecords({ sesh }: any) {
  const [records, setRecords] = useState([] as IRecord[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [recordID, setRecordID] = useState("");
  const [tableData, setTableData] = useState<IRecord[]>([]);
  const fetchRecords = async () => {
    const res = await fetch("/api/records/get_records", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setRecords(data.records);
      setTableData(data.records);
      setLoading(false);
    } else {
      setError(true);
    }
  };
  const filterTable = (e: any) => {
    const value = e.target.value.toLowerCase();
    const filteredData = records.filter((row: any) => {
      return (
        row.lastName.toLowerCase().includes(value) ||
        row.firstName.toLowerCase().includes(value) ||
        row.middleName.toLowerCase().includes(value) ||
        row.addressLine1.toLowerCase().includes(value)
      );
    });
    setTableData(filteredData);
  };
  useEffect(() => {
    fetchRecords();
  }, []);

  const clearFilter = () => {
    setTableData(records);
    const filter = document.getElementById("filter") as HTMLInputElement;
    filter.value = "";
  };
  const handleViewRecord = (e: any) => {
    e.preventDefault();
    setShowViewModal(true);
    setRecordID(e.target.getAttribute("data-id"));
  };
  const handleDelete = async (e: any) => {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");

    console.log(id, sesh?.name);
    const res = await fetch("/api/records/archive_record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, adminName: sesh?.name }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      window.location.reload();
    } else {
      console.log(data);
    }
  };
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
  const columns: TableColumn<any>[] = [
    {
      name: "Last Name",
      selector: (row) => row.lastName,
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
    },
    {
      name: "Middle Name",
      selector: (row) => row.middleName,
    },
    {
      name: "Birth Date",
      selector: (row) => new Date(row.birthDate).toLocaleDateString(),
    },
    {
      name: "Address",
      selector: (row) => row.addressLine1,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className=" flex gap-5 justify-center items-center   ">
          <button
            className="py-2 px-2 font-SegoeUI text-sm font-bold text-white bg-primary hover:bg-highlight rounded-md shadow-md transition-all duration-100 ease-in"
            data-id={`${row?._id}`}
            onClick={handleViewRecord}
          >
            <i className="fa-solid fa-eye mr-3"></i>
            View Record
          </button>
          <button
            className="py-2 px-5 font-SegoeUI text-sm font-bold text-white bg-primary hover:bg-highlight rounded-md shadow-md transition-all duration-100 ease-in"
            data-id={`${row?._id}`}
          >
            <i className="fa-solid fa-pencil mr-3"></i>
            Edit
          </button>
          <button
            className="py-2 px-5 font-SegoeUI text-sm font-bold text-error2 border-2 border-error2  rounded-md shadow-md hover:bg-error2 hover:text-white transition-all duration-100 ease-in"
            data-id={`${row?._id}`}
            onClick={handleDelete}
          >
            <i className="fa-solid fa-trash mr-3"></i>
            Archive
          </button>
        </div>
      ),
      width: "500px",
    },
  ];
  return (
    <div className="ml-56 pt-20 ">
      <div className="container mx-auto">
        <h1 className="text-2xl text-primary font-SegoeUI font-bold border-b py-2">
          Barangay Records
        </h1>
        <div className="py-5">
          <div className="flex">
            <div className="w-1/2 py-5">
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
            <div className=" py-5  w-1/2 text-right">
              <button
                className="bg-primary text-customWhite font-SegoeUI font-bold text-md py-2 px-4 rounded-md shadow-md hover:bg-highlight transition-all duration-100 ease-in"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fa-solid fa-plus mr-3"></i>
                Add Record
              </button>
            </div>
          </div>
          <div>
            <DataTable
              columns={columns}
              data={tableData}
              customStyles={customStyles}
              pagination
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "of",
                noRowsPerPage: true,
              }}
              progressPending={loading}
              highlightOnHover
              pointerOnHover
              striped
              responsive
            />
          </div>
        </div>
      </div>
      {showAddModal && (
        <CreateRecord sesh={sesh} setShowAddModal={setShowAddModal} />
      )}
      {showViewModal && (
        <ViewRecordModal
          recordID={recordID}
          setShowViewModal={setShowViewModal}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const sesh = { ...session } as any;
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
