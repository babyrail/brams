import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { CustomSession } from "../api/auth/[...nextauth]";
import { IAnnouncement } from "../../models/announcementModel";
import User from "../../models/userAccounts";
import dbConnect from "../../lib/dbConnect";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export default function Index() {
  const MySwal = withReactContent(Swal);

  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  function beautifyDate(dateStr: Date) {
    const date = new Date(dateStr) as any;
    const now = new Date() as any;
    const elapsedSeconds = Math.round((now - date) / 1000);

    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} seconds ago`;
    } else if (elapsedSeconds < 60 * 60) {
      const minutes = Math.round(elapsedSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (elapsedSeconds < 60 * 60 * 24) {
      const hours = Math.round(elapsedSeconds / (60 * 60));
      return `${hours} hours ago`;
    } else {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    }
  }

  const [announcements, setAnnouncements] = useState([] as IAnnouncement[]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/announcements/get_announcements", {
        method: "POST",
      });
      if (res.ok) {
        const json = await res.json();
        setAnnouncements(json.announcement);
        console.log(announcements);
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
  return (
    <div className="ml-48 2xl:ml-56">
      <div className="container mx-auto">
        <div className=" mt-5 ">
          <h1 className="text-2xl font-SegoeUI font-bold">
            Welcome, {session?.name}
          </h1>
        </div>
      </div>
      <div className="w-full flex justify-center gap-5 px-5 py-5">
        <div className="w-2/3 mt-5   bg-white rounded-lg p-5">
          <h1 className="font-SegoeUI font-bold  text-primary text-2xl  drop-shadow-lg border-b border-gray-700 pb-2">
            Announcements
          </h1>
          <div className="flex justify-center items-center flex-col py-5 gap-5">
            {announcements.reverse().map((announcement, index) => (
              <div className="bg-customWhite p-5 shadow-lg rounded-md border">
                <h1 className="text-3xl font-SegoeUI font-bold capitalize">
                  {announcement.title}
                </h1>
                <h1 className="font-SegoeUI ">
                  {beautifyDate(announcement.date)}
                </h1>
                <div className=" h-80 overflow-hidden flex justify-center items-center">
                  <img
                    src={announcement.image}
                    alt=""
                    className="min-w-2/3 max-w-2/3 w-2/3 mx-auto"
                  />
                </div>
                <p className="px-10 py-5">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/3 mt-5    bg-white rounded-lg p-5">
          <h1 className="font-SegoeUI font-bold text-primary text-xl drop-shadow-lg border-b border-gray-700">
            Important Announcements
          </h1>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  await dbConnect();
  console.log(session?.name);
  const user = await User.findOne({ username: session?.name });
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (!user.verified) {
    return {
      redirect: {
        destination: "/user/unverified",
        permanent: false,
      },
    };
  }

  return { props: { props: { session } } };
}
