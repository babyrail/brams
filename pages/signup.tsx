import React from "react";
import Wave from "react-wavify";
import Link from "next/link";
import { useState, useEffect } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { CSSProperties } from "react";
import { getSession, signIn } from "next-auth/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const override: CSSProperties = {
  display: "block",
  marginTop: "10px",
  borderColor: "red",
};

export default function Signup({ sesh }: { sesh: any }) {
  const MySwal = withReactContent(Swal);

  const swalFireSuccess = () => {
    MySwal.fire({
      title: "Success!",
      text: "Your account has been created!",
      icon: "success",
      confirmButtonText: "Cool",
    });
  };

  const swalFireWarning = (message: string) => {
    MySwal.fire({
      title: "Warning!",
      text: message,
      icon: "warning",
      confirmButtonText: "Ok",
    });
  };
  const [focusedUsername, setFocusedUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [focusedConfirmPassword, setFocusedConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedFirstName, setFocusedFirstName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [focusedLastName, setFocusedLastName] = useState(false);
  const [lastName, setLastName] = useState("");
  const [focusedMiddleName, setFocusedMiddleName] = useState(false);
  const [middleName, setMiddleName] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loginForm = document.getElementById("login-form");
    loginForm?.animate(
      [
        // keyframes

        { transform: "scale(0)" },
        { transform: "scale(1" },
      ],
      {
        duration: 700,
        easing: "ease-in-out",
        fill: "forwards",
      }
    );
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword && password.length < 8) {
      swalFireWarning(
        "Passwords do not match and must be at least 8 characters long"
      );
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      swalFireWarning("Passwords do not match");
      setLoading(false);
      return;
    }

    if (firstName.length < 1 || lastName.length < 1 || password.length < 0) {
      swalFireWarning("Please fill out all fields");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      swalFireWarning("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    const payload = {
      username,
      password,
      firstName,
      lastName,
      middleName,
    };
    console.log(JSON.stringify(payload));
    const response = await fetch("api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      console.log(data)
      swalFireWarning(data.error);
      setLoading(false);
      return;
    }
    const data = await response.json();
    setLoading(false);
    console.log(data);

    const signInPayload = {
      username,
      password,
    };
    const login = await signIn("user-login", {
      ...signInPayload,
      redirect: false,
    });
    if (login?.status != 200) {
      if (login?.error) {
        swalFireWarning(login?.error);
      } else {
      }
    } else {
      MySwal.fire({
        title: "Success!",
        text: "You have successfully signed up!",
        icon: "success",
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.href = "/user/unverified";
      }, 2000);
    }
  };

  return (
    <div className="relative">
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
      <div className="  w-full bg-auto h-full min-h-screen  grid place-items-center py-10 ">
        <div
          className="w-[90%] md:w-1/2 h-fit  mx-auto rounded-2xl drop-shadow-2xl relative z-10 flex flex-col-reverse md:flex-row overflow-hidden scale-0   "
          id="login-form"
        >
          <div className="bg-gradient-to-b from-[#00ADD8] to-[#338FCC] h-2/3 md:h-full md:py-20  w-full md:w-1/2 md:scale-100 relative">
            <a href="/login" className="absolute top-10 text-customWhite text-2xl left-10"><i className="fa-solid fa-arrow-left"></i></a>
            <form
              action="POST"
              className="flex flex-col justify-center  md:h-full px-10 py-10 md:py-0 relative z-10 gap-8 md:gap-10 "
              onSubmit={handleSubmit}
            >
              <div className="border-b border-tertiary py-3">
                <h1 className="text-lg md:text-2xl drop-shadow-md font-Poppins font-bold text-customWhite">
                  Start Managing Your Records
                </h1>
                <p className="text-customWhite drop-shadow-md">
                  Sign Up for Your Barangay Account.
                </p>
              </div>
              <div className="flex flex-col gap-10">
                <div className="relative">
                  <input
                    title="firstName"
                    name="firstName"
                    type="text"
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-10 drop-shadow-md bg-customWhite p-2   focus:outline-none uppercase rounded-md "
                    onFocus={() => setFocusedFirstName(true)}
                    onBlur={() => setFocusedFirstName(false)}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedFirstName || firstName
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-sm font-Poppins font-semibold opacity-70 text-[customBlack] top-[0.6rem]  left-3 "
                    }`}
                    onClick={() =>
                      document.getElementsByName("firstName")[0].focus()
                    }
                  >
                    First Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    title="middleName"
                    name="middleName"
                    type="text"
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-10 drop-shadow-md bg-customWhite p-2   focus:outline-none uppercase rounded-md "
                    onFocus={() => setFocusedMiddleName(true)}
                    onBlur={() => setFocusedMiddleName(false)}
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedMiddleName || middleName
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-sm font-Poppins font-semibold opacity-70 text-[customBlack] top-[0.6rem]  left-3 "
                    }`}
                    onClick={() =>
                      document.getElementsByName("middleName")[0].focus()
                    }
                  >
                    Middle Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    title="lastName"
                    name="lastName"
                    type="text"
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-10 drop-shadow-md bg-customWhite p-2   focus:outline-none uppercase rounded-md "
                    onFocus={() => setFocusedLastName(true)}
                    onBlur={() => setFocusedLastName(false)}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedLastName || lastName
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-sm font-Poppins font-semibold opacity-70 text-[customBlack] top-[0.6rem]  left-3 "
                    }`}
                    onClick={() =>
                      document.getElementsByName("lastName")[0].focus()
                    }
                  >
                    Last Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    title="username"
                    name="username"
                    type="text"
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-10 drop-shadow-md bg-customWhite p-2   focus:outline-none rounded-md "
                    onFocus={() => setFocusedUsername(true)}
                    onBlur={() => setFocusedUsername(false)}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedUsername || username
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-sm font-Poppins font-semibold opacity-70 text-[customBlack] top-[0.6rem]  left-3 "
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
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-10 drop-shadow-md bg-customWhite p-2   focus:outline-none rounded-md "
                    onFocus={() => setFocusedPassword(true)}
                    onBlur={() => setFocusedPassword(false)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedPassword || password
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-sm font-Poppins font-semibold opacity-70 text-[customBlack] top-[0.6rem]  left-3 "
                    }`}
                    onClick={() =>
                      document.getElementsByName("password")[0].focus()
                    }
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    title="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="w-full border-b border-b-customWhite text-customBlack h-10 md:h-10 drop-shadow-md bg-customWhite p-2   focus:outline-none rounded-md "
                    onFocus={() => setFocusedConfirmPassword(true)}
                    onBlur={() => setFocusedConfirmPassword(false)}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label
                    className={`absolute transition-all duration-200 cursor-text font-Poppins   ${
                      focusedConfirmPassword || confirmPassword
                        ? " text-md text-customWhite left-0 top-[-30px]"
                        : "text-sm font-Poppins font-semibold opacity-70 text-[customBlack] top-[0.6rem]  left-3 "
                    }`}
                    onClick={() =>
                      document.getElementsByName("confirmPassword")[0].focus()
                    }
                  >
                    Confirm Password
                  </label>

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
                  className="bg-transparent border-2 border-tertiary hover:bg-tertiary hover:text-customBlack transition-colors text-customWhite font-Poppins font-semibold text-lg md:text-xl h-10 md:h-10 rounded-md"
                  type="submit"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
          <div className="w-full  md:w-1/2 bg-bgImage bg-no-repeat bg-cover backdrop-brightness-50  grid place-content-center rounded-t-2xl md:rounded-none p-5 md:p-0">
            <img
              src="/barms-logo.png"
              alt=""
              className="w-1/2 md:w-1/2 mx-auto mt-3"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = (await getSession(context)) as any;
  const sesh = { ...session };

  return {
    props: { props: { sesh } },
  };
}
