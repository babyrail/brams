import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { useSession, getSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface CustomSession extends Session {
  name: string;
  expirationTime: Date;
}

export default function Unverified() {
  const MySwal = withReactContent(Swal);
  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  const [verificationCode, setVerificationCode] = useState<string[]>(
    new Array(4).fill("")
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { value } = target;
    const val = value.substring(value.length - 1);
    setActiveIndex(index + 1);
    target.value = val;
    const newVerificationCode: string[] = [...verificationCode];
    newVerificationCode[index] = val;
    setVerificationCode(newVerificationCode);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeIndex]);

  const handleOnSubmit = async (e: any) => {
    e.preventDefault;

    let newCode: string = "";
    for (let i = 0; i < verificationCode.length; i++) {
      newCode += verificationCode[i];
    }
    const data = {
      code: newCode,
      name: session?.name,
      expirationTime: session?.expirationTime,
    };
    const response = (await fetch("/api/user/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })) as any;

    const res = await response.json();
    if (response?.status === 200) {
      MySwal.fire({
        title: "Success!",
        text: "Verification Successful!",
        icon: "success",
        confirmButtonText: "Ok",
      });
      setTimeout(() => {
        window.location.href = "/user/";
      }, 2000);
    } else {
      MySwal.fire({
        title: "Error!",
        text: res?.message || "Verification Failed!",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  return (
    <div className="bg-customWhite h-[90vh]">
      <div className="p-20">
        <h1 className="text-3xl font-bold text-center">
          Your account is not verified yet
        </h1>
        <p className="text-center">
          We sent a verifcation code in your registerd mobile number.
        </p>
        <div className="flex justify-center gap-5 mt-10">
          {verificationCode.map((_, index) => {
            return (
              <React.Fragment key={index}>
                <input
                  ref={index === activeIndex ? inputRef : null}
                  title={`input${index}`}
                  key={index}
                  onChange={(e) => {
                    handleOnChange(e, index);
                  }}
                  className="shadow-sm h-16 aspect-square rounded-xl border text-center spin-button-none"
                />
              </React.Fragment>
            );
          })}
        </div>

        <div className="text-center mt-5">
          <button
            className="bg-primary py-2 px-4 rounded-lg shadow-sm text-center font-Poppins font-semibold text-customWhite"
            onClick={handleOnSubmit}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const sesh = { ...session };
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: { props: { session } } };
}
