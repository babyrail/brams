import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
interface Accounts {
  username: string;
  privilege: string;
  image: string;
}
export default function manageUsers() {
  const MySwal = withReactContent(Swal);

  const [data, setData] = useState([] as Accounts[]);
  const [file, setFile] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/get_users", {
        method: "POST",
      });

      if (res.ok) {
        const json = await res.json();
        setData(json.users);
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
  const createUser = async (event: any) => {
    event.preventDefault();

    const username = event?.target?.username?.value;
    const password = event?.target?.password?.value;
    const privilege = event?.target?.privilege?.value;
    const confirmPassword = event?.target?.confirmPassword?.value;
    if (!username || !password || !privilege) {
      MySwal.fire({
        title: "Error",
        text: "Please fill up all fields",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    if (!file) {
      MySwal.fire({
        title: "Error",
        text: "Please upload an image",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    if (password.length < 8) {
      MySwal.fire({
        title: "Error",
        text: "Password must be at least 8 characters",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    if (password !== confirmPassword) {
      MySwal.fire({
        title: "Error",
        text: "Password does not match",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
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
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, privilege, image }),
    });
    if (res.ok) {
      const json = await res.json();
      MySwal.fire({
        title: "Success",
        text: "User has been created",
        icon: "success",
        showConfirmButton: false,
      });
      window.location.reload();
    } else {
      MySwal.fire({
        title: "Error",
        text: "There has been an error saving your record",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  const deleteAccount = async (username: string) => {
    console.log(username);
    const res = await fetch("/api/admin/delete_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      const json = await res.json();
      window.location.reload();
    }
  };

  return (
    <div className="ml-56 pt-20">
      <div className="container mx-auto">
        <div className=" border-b p-5 flex justify-between items-center">
          <h1 className="font-SegoeUI font-semibold text-2xl text-primary drop-shadow">
            User Management
          </h1>
          <button
            type="button"
            title="add-user"
            className="text-primary border-2 border-primary rounded-full px-5 py-2 font-SegoeUI font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out drop-shadow-sm"
            onClick={() => {
              const form = document.getElementById(
                "createUserForm"
              ) as HTMLDivElement;
              form?.classList.toggle("hidden");
            }}
          >
            Add User <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 xl:grid-cols-3 gap-x-10 gap-y-5 ">
          {data.map((user, index) => (
            <div
              key={user.username}
              className=" bg-white flex relative shadow-lg "
            >
              <div className="w-1/3 p-5 ">
                <img
                  className=" rounded-full shadow-lg"
                  src={
                    user?.image
                      ? user.image
                      : "https://res.cloudinary.com/dk3msiid1/image/upload/v1683644713/placeholder_hhvgb8.jpg"
                  }
                  alt=""
                />
              </div>
              <div className=" w-2/3  flex justify-between  py-5 px-8">
                <div className=" w-full ">
                  <h1 className="font-SegoeUI font-semibold text-xl text-black drop-shadow capitalize">
                    {user.username}
                  </h1>
                  <p className="font-SegoeUI font-semibold text-md text-customBlack drop-shadow capitalize">
                    {user.privilege}
                  </p>
                </div>
                <div className="relative h-full">
                  <button
                    type="button"
                    title="delete-user"
                    className="font-SegoeUI font-semibold font-lg px-4 py-2 flex justify-between items-center w-full text-error"
                    onClick={() => deleteAccount(user.username)}
                  >
                    <i className="fas fa-trash text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="absolute bg-black bg-opacity-50 top-0 right-0 z-10 w-screen h-screen hidden"
        id="createUserForm"
      >
        <div className=" bg-black bg-opacity-50 w-full h-full ">
          <form action="POST" onSubmit={createUser}>
            <div className="bg-white w-full xl:w-1/2 mx-auto mt-20 p-5">
              <div className="flex justify-between items-center">
                <h1 className="font-SegoeUI font-semibold text-2xl  drop-shadow">
                  Add User
                </h1>
                <button
                  type="button"
                  title="close"
                  className="text-primary border-2 border-primary rounded-full px-5 py-2 font-SegoeUI font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out drop-shadow-sm"
                  onClick={() => {
                    const form = document.getElementById(
                      "createUserForm"
                    ) as HTMLDivElement;
                    form?.classList.toggle("hidden");
                  }}
                >
                  Close <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flex justify-between items-center mt-5 ">
                <div className="w-1/5 mx-auto relative">
                  <img
                    src="https://res.cloudinary.com/dk3msiid1/image/upload/v1683644713/placeholder_hhvgb8.jpg"
                    alt=""
                    className=" top-0 left-0  rounded-full shadow-lg"
                    id="profile-pic-preview"
                  />
                  <input
                    title="profile-pic"
                    type="file"
                    accept="image/*"
                    name="profile-pic"
                    id="profile-pic"
                    className="w-full h-full opacity-0 cursor-pointer  absolute top-0 left-0  rounded-full shadow-lg"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-5 gap-5 flex-col xl:flex-row">
                <div className="w-1/2">
                  <label
                    htmlFor="username"
                    className="font-SegoeUI font-semibold text-md  drop-shadow capitalize"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="w-full border-2  rounded-md px-5 py-2 font-SegoeUI font-bold   transition duration-300 ease-in-out drop-shadow-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="privilege"
                    className="font-SegoeUI font-semibold text-md  drop-shadow capitalize"
                  >
                    Privilege
                  </label>
                  <select
                    name="privilege"
                    id="privilege"
                    className="w-full border-2  rounded-md px-5 py-2 font-SegoeUI font-bold   transition duration-300 ease-in-out drop-shadow-sm"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-5 gap-5 flex-col xl:flex-row">
                <div className="w-1/2">
                  <label
                    htmlFor="password"
                    className="font-SegoeUI font-semibold text-md  drop-shadow capitalize"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-full border-2  rounded-md px-5 py-2 font-SegoeUI font-bold   transition duration-300 ease-in-out drop-shadow-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="confirmPassword"
                    className="font-SegoeUI font-semibold text-md  drop-shadow capitalize"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="w-full border-2  rounded-md px-5 py-2 font-SegoeUI font-bold   transition duration-300 ease-in-out drop-shadow-sm"
                  />
                </div>
              </div>
              {/* file input for image */}

              <div className="flex justify-center items-center mt-5">
                <button
                  type="submit"
                  title="submit"
                  className="text-primary border-primary border-2 rounded-full px-5 py-2 font-SegoeUI font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out drop-shadow-sm"
                  onSubmit={createUser}
                >
                  Submit <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          </form>
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
        destination: "/admin/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
