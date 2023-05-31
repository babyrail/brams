import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSession, useSession } from "next-auth/react";
import { CustomSession } from "../../api/auth/[...nextauth]";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export default function requestDocument() {
  const MySwal = withReactContent(Swal);
  const swalFireSuccess = (message?: string) => {
    MySwal.fire({
      title: "Success!",
      text: "Your request has been submitted",
      icon: "success",
      confirmButtonText: "Ok",
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
  const { data: session } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "unauthenticated" | "authenticated";
  };
  const sesh = { ...session };
  const today = new Date();
  const [date, setDate] = useState(today);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("GCASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [price, setPrice] = useState(0);
  const handleSelection = (e: any) => {
    const target = e.target.getAttribute("data-target");
    e.target.classList.toggle("bg-primary");
    e.target.classList.toggle("text-customWhite");
    const checkbox = document.querySelector(`#${target}`);
    checkbox?.toggleAttribute("checked");
    const docsOptions = document.querySelectorAll("input[type=checkbox]");
    let selected = [] as any;
    setPrice(0);
    docsOptions.forEach((checkbox: any) => {
      if (checkbox.checked) {
        selected.push(checkbox.getAttribute("name"));
      }
    });
    selected.forEach((doc: any) => {
      if (doc == "CLEARANCE") {
        setPrice((prev) => prev + 50);
      } else if (doc == "INDIGENCY") {
        setPrice((prev) => prev + 50);
      } else if (doc == "CEDULA") {
        setPrice((prev) => prev + 40);
      }
    });
    console.log(price);
    setSelectedDocs(selected);
  };
  const handleOnSubmit = async (e: any) => {
    const userID = sesh?.id;
    e.preventDefault();
    const form = e.target;
    const checkboxes = form.querySelectorAll("input[type=checkbox]");
    let selected = [] as any;
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      if (checkbox.checked) {
        selected.push(checkbox.getAttribute("name"));
        console.log(checkbox.getAttribute("name"));
      }
      console.log(selected);
    });

    const res = await fetch(`/api/records/get_record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userID,
      }),
    });
    const residentInfo = await res.json();
    if (!residentInfo.success) {
      swalFireWarning("Something Went Wrong");
    } else {
      if (
        (residentInfo.data.firstName == firstName &&
          residentInfo.data.lastName == lastName) ||
        residentInfo.data.middlName == middleName
      ) {
        let fullName = `${residentInfo.data.lastName}, ${residentInfo.data.firstName}, ${residentInfo.data.middleName}`;
        //get age from birthday
        const age =
          new Date().getFullYear() -
          new Date(residentInfo.data.birthDate).getFullYear();

        const body = {
          user_id: userID,
          user_name: fullName,
          user_age: age,
          request_type: selected,
          pickup_date: date,
          purpose,
          paymentMethod,
          refNum: referenceNumber,
          price,
        };
        const newRes = await fetch("/api/requests/create_request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        // if (newRes.ok) {
        //   swalFireSuccess();
        //   window.location.reload();
        // } else {
        //   swalFireWarning("There's an error saving your request");
        // }
        const newResJson = await newRes.json();
        if (newResJson.error) {
          swalFireWarning(newResJson.error);
        } else {
          swalFireSuccess();
          window.location.reload();
        }
      } else {
        swalFireWarning("We cannot confirm your request due to incorrect name");
      }
    }
  };
  return (
    <div className="ml-48 2xl:ml-56 pt-20 py-5">
      <div className="container mx-auto">
        <h2 className="font-SegoeUI font-bold text-2xl text-primary border-b pb-5 ">
          Documents Request Form
        </h2>
        <div>
          <form
            action="POST"
            className="w-3/4 mx-auto"
            onSubmit={handleOnSubmit}
          >
            <div className="bg-white shadow-md rounded-md p-5 mt-5 flex flex-col gap-5">
              <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Resident's Name
                </h1>
                <div className="flex gap-5 flex-col md:flex-row mt-5 md:mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    className="border bg-gray-100 rounded-md p-2 w-full uppercase"
                    value={firstName}
                    onChange={(event: any) =>
                      setFirstName(event.currentTarget.value.toUpperCase())
                    }
                  />
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    placeholder="Middle Name"
                    className="border bg-gray-100 rounded-md p-2 w-full uppercase"
                    value={middleName}
                    onChange={(event: any) =>
                      setMiddleName(event.currentTarget.value.toUpperCase())
                    }
                  />
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    className="border bg-gray-100 rounded-md p-2 w-full uppercase"
                    value={lastName}
                    onChange={(event: any) =>
                      setLastName(event.currentTarget.value.toUpperCase())
                    }
                  />
                </div>
              </div>
              {/* <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Pick Up Date
                </h1>
                <DatePicker
                  showIcon
                  minDate={date}
                  selected={date}
                  onChange={(newDate: Date) => setDate(newDate)}
                  className="border bg-gray-100 rounded-md p-2 w-full"
                />
              </div> */}
              <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Purpose
                </h1>
                <textarea
                  name="purpose"
                  id="purpose"
                  placeholder="Purpose"
                  className="border bg-gray-100 rounded-md p-2 w-full resize-none h-20"
                  value={purpose}
                  onChange={(event: any) => setPurpose(event.target.value)}
                />
              </div>
              <div>
                <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                  Document Type
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 brid justify-center items-center place-items-center gap-3">
                  <div className="w-full">
                    <input
                      title="Brgy. Clearance"
                      type="checkbox"
                      name="CLEARANCE"
                      id="clearance"
                      className="mr-2"
                      hidden
                    />
                    <div
                      className="flex justify-center items-center bg-customWhite py-4 cursor-pointer rounded-md"
                      data-target="clearance"
                      onClick={handleSelection}
                    >
                      <i className="fa-solid fa-file text-md 2xl:text-md  group-hover:text-customWhite "></i>
                      <h1 className="font-Poppins font-bold text-md 2xl:text-md ml-5  group-hover:text-customWhite  ">
                        Brgy. Clearance
                      </h1>
                    </div>
                  </div>
                  <div className="w-full">
                    <input
                      title="Indigency"
                      type="checkbox"
                      name="INDIGENCY"
                      id="indigency"
                      className="mr-2"
                      hidden
                    />
                    <div
                      className="flex justify-center items-center bg-customWhite py-4 cursor-pointer rounded-md  "
                      data-target="indigency"
                      onClick={handleSelection}
                    >
                      <i className="fa-solid fa-file text-md 2xl:text-md  group-hover:text-customWhite "></i>
                      <h1 className="font-Poppins font-bold text-md 2xl:text-md ml-5  group-hover:text-customWhite  ">
                        Brgy. Indigency
                      </h1>
                    </div>
                  </div>
                  <div className="w-full">
                    <input
                      title="Cedula"
                      type="checkbox"
                      name="CEDULA"
                      id="cedula"
                      className="mr-2"
                      hidden
                    />
                    <div
                      className="flex justify-center items-center bg-customWhite py-4 cursor-pointer rounded-md  "
                      data-target="cedula"
                      onClick={handleSelection}
                    >
                      <i className="fa-solid fa-file text-md 2xl:text-md  group-hover:text-customWhite "></i>
                      <h1 className="font-Poppins font-bold text-md 2xl:text-md ml-5  group-hover:text-customWhite  ">
                        Cedula
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <div className=" w-full">
                  <h1 className="font-SegoeUI font-bold text-sm 2xl:text-lg ">
                    Payment Options
                  </h1>
                  <div className="">
                    <select
                      name="payment-option"
                      id="payment-option"
                      title="Payment Option"
                      onChange={(e) => {
                        setPaymentMethod(e.currentTarget.value);
                      }}
                      value={paymentMethod}
                      className=" bg-gray-100 rounded-md  p-2 h-full mr-5"
                    >
                      <option value="GCASH">GCash</option>
                      <option value="PAYMAYA">PayMaya</option>
                      <option value="CASH">Over-the-Counter</option>
                    </select>
                    {paymentMethod != "CASH" ? (
                      <img
                        src={
                          paymentMethod == "GCASH"
                            ? "/gcashqr.png"
                            : paymentMethod == "PAYMAYA"
                            ? "/mayaqr.png"
                            : ""
                        }
                        alt=""
                        className="w-72"
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                {paymentMethod != "CASH" ? (
                  <div>
                    <h1 className="text-md font-SegoeUI font-bold ">
                      Reference No.
                    </h1>
                    <input
                      type="text"
                      name="paymentRefNo"
                      title="paymentRefNo"
                      id="paymentRefNo"
                      placeholder="Reference No."
                      className="bg-gray-100 rounded-md  p-2 w-54"
                      value={referenceNumber}
                      onChange={(e) => {
                        setReferenceNumber(e.currentTarget.value);
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="w-full">
                  <h1 className="text-md font-SegoeUI font-bold ">
                    Request Summary
                  </h1>
                  <div className="  p-2 w-full">
                    {selectedDocs.map((doc: any) => {
                      return (
                        <div className="flex justify-between items-center mb-2">
                          <h1 className="text-sm font-SegoeUI font-bold ">
                            {doc}
                          </h1>
                          <h1 className="text-sm font-SegoeUI font-bold ">
                            {doc == "CLEARANCE"
                              ? "₱50.00"
                              : doc == "INDIGENCY"
                              ? "₱50.00"
                              : doc == "CEDULA"
                              ? "₱40.00"
                              : ""}
                          </h1>
                        </div>
                      );
                    })}
                    {selectedDocs.length == 0 ? (
                      <h1 className="text-sm font-SegoeUI font-bold ">
                        No Selected Documents
                      </h1>
                    ) : (
                      //total
                      <div className="flex justify-between items-center border-t ">
                        <h1 className="text-sm font-SegoeUI font-bold ">
                          Total
                        </h1>
                        <h1 className="text-sm font-SegoeUI font-bold ">
                          ₱{price}.00
                        </h1>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button
                  className="bg-primary font-SegoeUI font-bold text-customWhite px-5 py-2 rounded-md hover:bg-highlight transition-all duration-100 ease-in  "
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const sesh = { ...session } as CustomSession;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { sesh } };
}
