import React, { CSSProperties, FormEventHandler } from "react";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { getSession, useSession } from "next-auth/react";
import { PuffLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  marginTop: "10px",
  borderColor: "red",
};

export default function Login({}) {
  const [focusedUsername, setFocusedUsername] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [username, setUsername] = useState("");
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

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { username, password };
    console.log(payload);
    const res = await signIn("admin-login", { ...payload, redirect: false });
    setLoading(false);
    if (res?.status != 200) {
      if (res?.error) {
        setError(res.error);
      } else {
        setError("");
      }
    } else {
      setError("");
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="container mx-auto py-20 flex flex-col-reverse md:flex-row justify-around">
        <div
          id="login-form"
          className="w-full max-h-full md:w-1/3 bg-white rounded-xl p-5 shadow-md border border-gray-200 min-h-[75svh] py-10 px-8 "
        >
          <form
            className="flex flex-col justify-between gap-12"
            onSubmit={handleLogin}
            method="POST"
          >
            <h1 className="font-Poppins font-light text-2xl">Welcome!</h1>
            <h1 className="font-Poppins font-semibold text-3xl">Log in</h1>
            <div className="relative ">
              <input
                title="username"
                type="text"
                name="username"
                className="w-full border-b border-b-gray-500  h-14 p-5 bg-transparent"
                onFocus={() => setFocusedUsername(true)}
                onBlur={() => setFocusedUsername(false)}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label
                className={`absolute transition-all duration-200 -z-10 ${
                  focusedUsername || username
                    ? " text-xl left-0 top-[-30px]"
                    : "text-gray-400 top-3  left-4 text-lg"
                }`}
              >
                Username
              </label>
            </div>
            <div className="relative">
              <input
                title="password"
                name="password"
                type="password"
                className="w-full border-b border-b-gray-500  h-14 p-5 bg-transparent"
                onFocus={() => setFocusedPassword(true)}
                onBlur={() => setFocusedPassword(false)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                className={`absolute transition-all duration-200 -z-10 ${
                  focusedPassword || password
                    ? " text-xl left-0 top-[-30px]"
                    : "text-gray-400 top-3  left-4 text-lg"
                }`}
              >
                Password
              </label>
              {loading && (
                <PuffLoader
                  loading={loading}
                  cssOverride={override}
                  size={30}
                />
              )}
              {error && (
                <p className="text-red-500 text-sm" id="passwordErr">
                  {error}
                </p>
              )}
              {!loading && session?.user?.name && (
                //show success login
                <p className="text-green-500 text-sm" id="passwordErr">
                  Login successful
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#1D1D1F] text-white font-Poppins font-semibold text-lg h-14 rounded-[3px] hover:bg-[#2D2D2F] transition-colors duration-300 shadow-2xl"
            >
              Log in
            </button>
          </form>
        </div>
        <div
          id="logo-container"
          className="w-full md:w-1/2 place-items-center grid"
        >
          <img src="/barms-logo.png" alt="barms-logo" className="w-3/5" />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = (await getSession(context)) as any;
  const sesh = { ...session };
  if (session) {
    if (sesh.role === "superadmin") {
      return {
        redirect: {
          destination: "/admin/dashboard",
          permanent: false,
        },
      };
    }
    if (sesh.role === "admin") {
      return {
        redirect: {
          destination: "/admin/dashboard",
          permanent: false,
        },
      };
    }
  }

  return { props: { sesh } };
}
