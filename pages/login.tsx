import React, { useEffect } from "react";
import Wave from "react-wavify";
import { useState } from "react";
import Link from "next/link";
import { FormEventHandler } from "react";
import { signIn } from "next-auth/react";
import { useSession, getSession } from "next-auth/react";
import { PuffLoader } from "react-spinners";
import { CSSProperties } from "react";
import { GetServerSidePropsContext } from "next";
const override: CSSProperties = {
  display: "block",
  marginTop: "10px",
  borderColor: "red",
};

export default function Login() {
  const [focusedUsername, setFocusedUsername] = useState(false);
  const [username, setUsername] = useState("");

  const [focusedPassword, setFocusedPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    const loginForm = document.getElementById("login-form");
    loginForm?.animate(
      [
        // keyframes

        { transform: "scale(0)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 700,
        easing: "ease-in-out",
        fill: "forwards",
      }
    );
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const payload = { username, password };
    const res = await signIn("user-login", { ...payload, redirect: false });
    setLoading(false);
    if (res?.status != 200) {
      if (res?.error) {
        setError(res.error);
      } else {
      }
    } else {
      setError("");
      console.log("welcome");
      window.location.reload();
    }
  };

  return (
    <>
      <Wave
        className="absolute bottom-0 -z-50  overflow-visible h-[30vh] "
        fill="#1994e6"
        paused={false}
        options={{
          height: 20,
          amplitude: 70,
          speed: 0.18,
          points: 5,
        }}
      />
      <div className="  w-full bg-auto h-screen  grid place-items-center  ">
        <div
          className="w-[90%] md:w-1/2 h-fit md:h-[70vh]  mx-auto rounded-2xl drop-shadow-2xl  relative z-10 flex flex-col-reverse md:flex-row overflow-hidden scale-0"
          id="login-form"
        >
          <div className="bg-gradient-to-b from-[#00ADD8] to-[#338FCC] h-2/3 md:h-full  w-full md:w-1/2 md:scale-100 ">
            <form
              action="POST"
              className="flex flex-col justify-center  md:h-full px-10 py-10 md:py-0 relative z-10 gap-8 md:gap-10 "
              onSubmit={handleSubmit}
            >
              <div className="border-b border-tertiary py-3">
                <h1 className="text-lg md:text-2xl drop-shadow-md font-Poppins font-bold text-customWhite">
                  Welcome Back!
                </h1>
                <p className="text-customWhite drop-shadow-md">
                  Your Gateway to Barangay Services - Log in to Manage Your
                  Records.
                </p>
              </div>
              <div className="flex flex-col gap-10">
                <div className="relative">
                  <input
                    title="username"
                    name="username"
                    type="text"
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-14 drop-shadow-md bg-customWhite p-2   focus:outline-none rounded-md "
                    onFocus={() => setFocusedUsername(true)}
                    onBlur={() => setFocusedUsername(false)}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedUsername || username
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-base font-Poppins font-semibold opacity-70 text-[customBlack] top-[1.1rem]  left-3 "
                    }`}
                    onClick={() =>
                      document.getElementsByName("username")[0].focus()
                    }
                  >
                    Username
                  </label>
                </div>
                <div className="relative">
                  <input
                    title="password"
                    name="password"
                    type="password"
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-14 drop-shadow-md bg-customWhite p-2   focus:outline-none rounded-md "
                    onFocus={() => setFocusedPassword(true)}
                    onBlur={() => setFocusedPassword(false)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedPassword || password
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-base font-Poppins font-semibold opacity-70 text-[customBlack] top-[1.1rem]  left-3 "
                    }`}
                    onClick={() =>
                      document.getElementsByName("password")[0].focus()
                    }
                  >
                    Password
                  </label>
                  {error && (
                    <p className="text-error text-sm font-Poppins font-semibold">
                      {error}
                    </p>
                  )}
                  {loading && (
                    //show success login
                    <PuffLoader
                      loading={loading}
                      cssOverride={override}
                      size={30}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <button
                  className="bg-transparent border-2 border-tertiary hover:bg-tertiary hover:text-customBlack transition-colors text-customWhite font-Poppins font-semibold text-lg md:text-xl h-10 md:h-14 rounded-md"
                  type="submit"
                >
                  Log in
                </button>
                <div className="text-customWhite drop-shadow-sm">
                  <p>
                    Don't have an account?
                    <span>
                      <Link
                        href="/signup"
                        className=" hover:text-[#002A5C] text-customWhite transition-colors font-bold underline mx-2"
                      >
                        Sign up
                      </Link>
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div className="w-full h-1/3 md:h-full md:w-1/2 bg-bgImage bg-cover bg-no-repeat grid place-content-center rounded-t-2xl md:rounded-none p-5 md:p-0">
            <img
              src="/barms-logo.png"
              alt=""
              className="w-1/2 md:w-1/2 mx-auto mt-3"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const sesh = { ...session };
  if (session) {
    if (sesh.role === "user") {
      return {
        redirect: {
          destination: "/user/",
          permanent: false,
        },
      };
    }
    if (sesh.role === "unverified") {
      return {
        redirect: {
          destination: "/user/unverified",
          permanent: false,
        },
      };
    }
  }
  return { props: { props: { session } } };
}
