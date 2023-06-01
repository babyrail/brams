import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ViewRecipientModal from "../components/viewRecipientModal";

export default function ayudaRecipientList() {
  const [recipientList, setRecipientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const fetchRecipientList = async () => {
    setLoading(true);
    const res = await fetch("/api/ayuda/get-recipients", {
      method: "GET",
    });
    if (res.ok) {
      const json = await res.json();
      setRecipientList(json.assistance);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRecipientList();
  }, []);
  const column: TableColumn<any>[] = [
    {
      name: "Recipient's Name",
      selector: (row: any) => {
        return row.recipient_name;
      },
    },
    {
      name: "Status",
      selector: (row: any) => {
        return row.status;
      },
    },
    {
      name: "Action",
      cell: (row: any) => {
        return (
          <div className="flex flex-row space-x-2">
            <button
              className="bg-green-500 rounded-md px-3 py-2 text-white hover:bg-green-600 transition-all duration-200 ease-in"
              onClick={() => {
                setShowViewModal(true);
              }}
            >
              View
            </button>
            <button className="bg-blue-500 rounded-md px-3 py-2 text-white hover:bg-blue-600 transition-all duration-200 ease-in">
              Edit
            </button>
            <button className="bg-red-500 rounded-md px-3 py-2 text-white hover:bg-red-600 transition-all duration-200 ease-in">
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="ml-48 2xl:ml-56 pt-20 py-5">
      <div className="container mx-auto">
        <h1 className="text-2xl font-SegoeUI text-primary font-bold border-b py-2">
          Ayuda Recipient's List
        </h1>
        <div className="mt-5">
          <DataTable
            columns={column}
            data={recipientList}
            progressPending={loading}
          />
        </div>
      </div>
      {showViewModal && (
        <ViewRecipientModal setShowViewModal={setShowViewModal} />
      )}
    </div>
  );
}
