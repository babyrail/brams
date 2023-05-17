import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { IAnnouncement } from "../../../models/announcementModel";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";
export default function createAnnouncements() {
  const [data, setData] = useState([] as IAnnouncement[]);
  const MySwal = withReactContent(Swal);
  const [editEnabled, setEditEnabled] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("/api/announcements/get_announcements", {
        method: "POST",
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.announcement);
        setLoading(false);
      } else {
        setLoading(false);
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
  function handleOnChange(event: any) {
    const file = event?.target?.files[0] as File;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event?.target?.result as any;
      setFile(dataUrl);
    };
    reader.readAsDataURL(file);
  }
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
  const showModalCreateAnnouncement = (event: any) => {
    event?.preventDefault();

    const formModal = document.getElementById("createAnnouncementForm");
    formModal?.classList.toggle("hidden");
    const body = document.querySelector("body");
    body?.classList.toggle("overflow-hidden");
  };
  const createAnnouncement = async (event: any) => {
    event?.preventDefault();

    const title = event?.target?.announcementFormTitle?.value;
    const content = event?.target?.announcementFormContent?.value;
    const formData = new FormData();
    formData.append("file", file as any);
    formData.append("upload_preset", "upload_resident");
    const responseImage = await fetch(
      "https://api.cloudinary.com/v1_1/dk3msiid1/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const jsonImage = await responseImage.json();
    const image = jsonImage.secure_url;
    const newAnnouncement = await fetch(
      "/api/announcements/create_announcements",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image }),
      }
    );
    if (newAnnouncement.ok) {
      MySwal.fire({
        title: "Success",
        text: "Announcement has been posted",
        icon: "success",
        showConfirmButton: false,
      });
      window.location.reload();
    } else {
      MySwal.fire({
        title: "Error",
        text: "There has been an error saving your announcement. Please try again later",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  return (
    <div className=" ml-48 2xl:ml-56 pt-20 py-5">
      <div className="container mx-auto  ">
        <div className="border-b py-5 flex justify-between items-center">
          <h1 className="font-SegoeUI font-bold  text-primary text-2xl  drop-shadow-lg ">
            Announcements
          </h1>
          <button
            type="button"
            title="add-user"
            className="text-primary border-2 border-primary rounded-full px-5 py-2 font-SegoeUI font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out drop-shadow-sm"
            onClick={showModalCreateAnnouncement}
          >
            Create Announcement <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="w-full py-5">
          {!loading ? data.reverse().map((item, index) => (
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
          )) : <div className="flex justify-center items-center mt-20"><BeatLoader color="#000000" size={15} /></div>}
        </div>
        <div
          className="absolute bg-black bg-opacity-50 top-0 right-0 z-10 w-screen h-screen hidden "
          id="createAnnouncementForm"
        >
          <div className="  w-full h-full ">
            <form action="POST" onSubmit={createAnnouncement}>
              <div className="bg-white w-full xl:w-1/2 mx-auto mt-20 p-5 ">
                <div className="flex justify-between items-center border-b pb-5">
                  <h1 className="font-SegoeUI font-semibold text-2xl  drop-shadow ">
                    Create New Announcement
                  </h1>
                  <button
                    type="button"
                    title="close"
                    className="text-primary border-2 border-primary rounded-full px-5 py-2 font-SegoeUI font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out drop-shadow-sm"
                    onClick={() => {
                      const form = document.getElementById(
                        "createAnnouncementForm"
                      ) as HTMLDivElement;
                      const body = document.querySelector("body");
                      body?.classList.toggle("overflow-hidden");
                      form?.classList.toggle("hidden");
                    }}
                  >
                    Close <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="flex justify-between items-center mt-5 gap-5 flex-col xl:flex-row">
                  <div className="w-full">
                    <label
                      htmlFor="announcementFormTitle"
                      className="font-SegoeUI font-semibold text-md  drop-shadow capitalize"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="announcementFormTitle"
                      id="announcementFormTitle"
                      className="w-full border-2  rounded-md px-5 py-2 font-SegoeUI font-bold   transition duration-300 ease-in-out drop-shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-5 gap-5 flex-col xl:flex-row">
                  <div className="w-full">
                    <label
                      htmlFor="announcementFormContent"
                      className="font-SegoeUI font-semibold text-md  drop-shadow capitalize"
                    >
                      Body
                    </label>
                    <textarea
                      className="w-full h-32 border-2  rounded-md px-5 py-2 font-SegoeUI font-bold   transition duration-300 ease-in-out drop-shadow-sm"
                      id="announcementFormContent"
                      name="announcementFormContent"
                      title="announcementFormContent"
                    ></textarea>
                  </div>
                </div>
                {/* file input for image */}
                <div className="flex justify-center items-center mt-5">
                  <div className="w-full flex flex-col">
                    <label
                      htmlFor="announcementFormImage"
                      className="font-SegoeUI font-semibold text-md  drop-shadow capitalize"
                    >
                      Photos
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="announcementFormImage"
                      id="announcementFormImage"
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center mt-5">
                  <button
                    type="submit"
                    title="submit"
                    className="text-primary border-primary border-2 rounded-full px-5 py-2 font-SegoeUI font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out drop-shadow-sm"
                  >
                    Submit <i className="fas fa-check"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return { props: { ...session } };
}
