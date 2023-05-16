import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { IAnnouncement } from "../../../models/announcementModel";

export default function createAnnouncements() {
  const [data, setData] = useState([] as IAnnouncement[]);
  const MySwal = withReactContent(Swal);
  const [editEnabled, setEditEnabled] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/announcements/get_announcements", {
        method: "POST",
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.announcement);
      } else {
        MySwal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    };
    fetchData();
  }, []);
  const deletePost = async (_id: string) => {
    const res = await fetch("/api/announcements/delete_announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    });
    if (res.ok) {
      MySwal.fire({
        title: "Success!",
        text: "Announcement deleted successfully",
        icon: "success",
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      MySwal.fire({
        title: "Error!",
        text: "Something went wrong",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  const createAnnouncement = async (event: any) => {
    event?.preventDefault();

    const formModal = document.getElementById("formModal");
    formModal?.classList.toggle("hidden");
    const body = document.querySelector("body");
    body?.classList.toggle("overflow-hidden");
  };
  return (
    <div className="ml-56 pt-20">
      <div className="container mx-auto">
        <div className="border-b py-5 flex justify-between items-center">
          <h1 className="font-SegoeUI font-bold  text-primary text-2xl  drop-shadow-lg ">
            Announcements
          </h1>
          <button
            type="button"
            title="add-user"
            className="text-primary border-2 border-primary rounded-full px-5 py-2 font-SegoeUI font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out drop-shadow-sm"
            onClick={createAnnouncement}
          >
            Create Announcement <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="w-full py-5">
          {data.map((item, index) => (
            <div key={index} className="w-full flex bg-white shadow-md mb-10 ">
              <div className="w-2/3 flex flex-col p-10 gap-10">
                <input type="hidden" name="announcementId" value={item._id} />
                <div className="flex items-center border-b  ">
                  <label
                    htmlFor="announcementTitle"
                    className="font-SegoeUI font-bold  text-2xl"
                  >
                    Title:&nbsp;
                  </label>
                  <input
                    type="text"
                    disabled={!editEnabled}
                    title="announcementTitle"
                    name="announcementTitle"
                    value={item.title}
                    className="font-SegoeUI font-bold text-2xl border-none outline-none w-full capitalize bg-white"
                  />
                </div>
                <div className="h-2/3 ">
                  <textarea
                    title="announcementContent"
                    name="announcementContent"
                    id="announcementContent"
                    value={item.content}
                    disabled={!editEnabled}
                    className="w-full h-56 max-h-full outline-none resize-none bg-white  border-none"
                  />
                </div>
                <div className="flex gap-5">
                  <button
                    className="bg-primary text-white font-semibold text-lg px-3 py-1 rounded-md transition duration-300 ease-in-out hover:bg-white hover:text-primary border-2 border-primary "
                    onClick={() => {
                      setEditEnabled(!editEnabled);
                    }}
                  >
                    {editEnabled ? (
                      <>
                        Save<i className="fa-solid fa-save  ml-2 "></i>
                      </>
                    ) : (
                      <>
                        Edit<i className="fa-solid fa-pencil  ml-2"></i>
                      </>
                    )}
                  </button>
                  <button
                    className="border-2 font-semibold text-error border-error px-3 py-1 rounded-md transition duration-300 ease-in-out hover:bg-error hover:text-white"
                    onClick={() => {
                      deletePost(item._id);
                      console.log(item._id);
                    }}
                  >
                    Delete <i className="fa-solid fa-trash ml-2"></i>
                  </button>
                </div>
              </div>
              <div className="w-1/3 flex justify-center items-center">
                <img src={item.image} alt="" className="" />
              </div>
            </div>
          ))}
        </div>
        <div
          className="absolute h-full w-full top-0 left-0 bg-black opacity-50 hidden"
          id="formModal"
        >
          <div className="w-1/2 bg-white  "></div>
        </div>
      </div>
    </div>
  );
}
