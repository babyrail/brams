import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useTable, CellProps } from "react-table";
import { Record } from "../../../models/BrgyRecords";
import CreateRecord from "./createRecord";
import ViewRecordModal from "../components/viewRecordModal";
export default function manageRecords({ sesh }: any) {
  const [records, setRecords] = useState([] as Record[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchMidName, setSearchMidName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [recordID, setRecordID] = useState("");
  const fetchRecords = async () => {
    const res = await fetch("/api/records/get_records", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setRecords(data.records);
      setLoading(false);
    } else {
      setError(true);
    }
  };
  const fetchRecord = async () => {
    const response = await fetch(
      `/api/records/?firstName=${searchFirstName.toUpperCase()}&lastName=${searchLastName.toUpperCase()}&middleName=${searchMidName.toUpperCase()}`
    );
    const data = await response.json();
    setRecords(data.records);
  };
  const handleClear = (e: any) => {
    e.preventDefault();
    setSearchFirstName("");
    setSearchLastName("");
    setSearchMidName("");
    fetchRecords();
  };
  useEffect(() => {
    fetchRecords();
  }, []);
  const handleSearch = (e: any) => {
    e.preventDefault();
    fetchRecord();
    console.log(records);
  };
  const handleViewRecord = (e: any) => {
    e.preventDefault();
    setShowViewModal(true);
    setRecordID(e.target.getAttribute("data-id"));

  };
  const handleDelete = async (e: any) => {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    const res = await fetch("/api/records/delete_record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      window.location.reload();
    } else {
      console.log(data);
    }
  };
  const data = useMemo(() => {
    let recordsData = [] as any;
    try {
      recordsData = records.map((record) => {
        const { lastName, firstName, middleName, birthDate, addressLine1 } =
          record;
        return {
          id: record._id,
          lastName,
          firstName,
          middleName: middleName || "-",
          birthDate: new Date(birthDate).toLocaleDateString(),
          address: addressLine1,
        };
      });
    } catch (err) {
      recordsData.push(records);
    }
    console.log(recordsData);
    return recordsData;
  }, [records]);
  const columns = useMemo(() => {
    return [
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Middle Name",
        accessor: "middleName",
      },
      {
        Header: "Birth Date",
        accessor: "birthDate",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Action",
        Cell: ({ row, cell }: CellProps<any>) => (
          <div className=" flex gap-5 justify-center ">
            <button
              className="py-2 px-2 font-SegoeUI text-sm font-bold text-white bg-primary hover:bg-highlight rounded-md shadow-md transition-all duration-100 ease-in"
              data-id={`${row?.original?.id}`}
              onClick={handleViewRecord}
            >
              <i className="fa-solid fa-eye mr-3"></i>
              View Record
            </button>
            <button
              className="py-2 px-5 font-SegoeUI text-sm font-bold text-white bg-primary hover:bg-highlight rounded-md shadow-md transition-all duration-100 ease-in"
              data-id={`${row?.original?.id}`}
            >
              <i className="fa-solid fa-pencil mr-3"></i>
              Edit
            </button>
            <button
              className="py-2 px-5 font-SegoeUI text-sm font-bold text-error2 border-2 border-error2  rounded-md shadow-md hover:bg-error2 hover:text-white transition-all duration-100 ease-in"
              data-id={`${row?.original?.id}`}
              onClick={handleDelete}
            >
              <i className="fa-solid fa-trash mr-3"></i>
              Delete
            </button>
          </div>
        ),
      },
    ];
  }, []) as any;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="ml-56 pt-20 ">
      <div className="container mx-auto">
        <h1 className="text-2xl text-primary font-SegoeUI font-bold border-b py-2">
          Barangay Records
        </h1>
        <div className="py-5">
          <div className="flex">
            <div className="w-1/2 py-5">
              <form
                action="POST"
                onSubmit={handleSearch}
                className="flex flex-col gap-5 w-full p-0"
              >
                <div className=" flex flex-col md:flex-row md:justify-between md:items-center w-full">
                  <label
                    htmlFor="firstName"
                    className="font-Poppins font-semibold text-lg"
                  >
                    First Name:
                  </label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    value={searchFirstName}
                    onChange={(e) => setSearchFirstName(e.target.value)}
                    className="p-2 md:w-96 font-Poppins border shadow-sm uppercase rounded-lg w-full"
                  />
                </div>
                <div className=" flex flex-col md:flex-row md:justify-between md:items-center w-full">
                  <label
                    htmlFor="middleName"
                    className="font-Poppins font-semibold text-lg"
                  >
                    Middle Name:
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    placeholder="Middle Name"
                    value={searchMidName}
                    onChange={(e) => setSearchMidName(e.target.value)}
                    className="p-2 md:w-96 font-Poppins border shadow-sm uppercase rounded-lg w-full"
                  />
                </div>
                <div className=" flex flex-col md:flex-row md:justify-between md:items-center w-full">
                  <label
                    htmlFor="lastName"
                    className="font-Poppins font-semibold text-lg"
                  >
                    Last Name:
                  </label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    value={searchLastName}
                    onChange={(e) => setSearchLastName(e.target.value)}
                    className="p-2 md:w-96 font-Poppins border shadow-sm uppercase rounded-lg w-full"
                  />
                </div>

                <div className="flex gap-5 justify-end">
                  <button
                    className="bg-primary w-full md:w-fit py-2 px-4 rounded-lg font-SegoeUI text-customWhite hover:bg-highlight font-bold"
                    onClick={handleClear}
                    type="button"
                  >
                    <i className="fa-solid fa-eraser mr-3"></i>
                    Clear Search
                  </button>
                  <button
                    type="submit"
                    className="bg-primary w-full md:w-fit py-2 px-4 rounded-lg font-SegoeUI text-customWhite hover:bg-highlight font-bold"
                  >
                    <i className="fa-solid fa-search mr-3"></i>
                    Search
                  </button>
                </div>
              </form>
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
          <table className=" w-full shadow-lg" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup: any) => (
                <tr
                  className="bg-primary text-customWhite font-SegoeUI font-bold text-md"
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column: any) => (
                    <th className="py-2 px-4" {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row: any) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell: any) => {
                      return (
                        <td
                          className="border px-4 py-2"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
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

interface CustomSession extends Session {
  role: string;
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
