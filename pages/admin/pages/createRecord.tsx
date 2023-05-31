import { useState } from "react";
import cloudinary from "next-cloudinary";
import { getSession, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { set } from "mongoose";

export default function CreateRecord({ sesh, setShowAddModal }: any) {
  const MySwal = withReactContent(Swal);

  const [file, setFile] = useState(null);
  const [isFamilyHead, setIsFamilyHead] = useState(false);
  function handleOnChange(event: any) {
    const file = event?.target?.files[0] as File;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event?.target?.result as any;
      setFile(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleOnSubmit(event: any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file as any);
    formData.append("upload_preset", "upload_resident");

    const upload = async () => {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dk3msiid1/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadImage = await response.json();
      console.log(uploadImage);
      const formData2 = new FormData();
      let gender = (
        document?.querySelector(
          'input[name="gender"]:checked'
        ) as HTMLInputElement
      )?.value;
      formData2.append(
        "firstName",
        (
          document.getElementById("newFirstName") as HTMLInputElement
        ).value.toUpperCase()
      );
      formData2.append(
        "lastName",
        (
          document.getElementById("newLastName") as HTMLInputElement
        ).value.toUpperCase()
      );
      formData2.append(
        "middleName",
        (
          document.getElementById("newMiddleName") as HTMLInputElement
        ).value.toUpperCase()
      );
      formData2.append(
        "suffix",

        (
          document.getElementById("suffix") as HTMLInputElement
        ).value.toUpperCase()
      );
      formData2.append(
        "birthDate",
        (document.getElementById("birthDate") as HTMLInputElement).value
      );
      formData2.append("gender", gender.toUpperCase());
      formData2.append(
        "civilStatus",
        (
          document.getElementById("civilStatus") as HTMLInputElement
        ).value.toUpperCase()
      );
      formData2.append(
        "occupation",
        (
          document.getElementById("occupation") as HTMLInputElement
        ).value.toUpperCase()
      );
      formData2.append(
        "email",
        (document.getElementById("email") as HTMLInputElement).value
      );
      formData2.append(
        "contactNumber",
        (document.getElementById("contactNumber") as HTMLInputElement).value
      );
      formData2.append(
        "addressLine1",
        (
          document.getElementById("address") as HTMLInputElement
        ).value.toUpperCase()
      );
      if (
        (document.getElementById("address2") as HTMLInputElement).value != ""
      ) {
        formData2.append(
          "addressLine2",
          (document.getElementById("address2") as HTMLInputElement).value
        );
      }
      formData2.append(
        "barangay",
        (document.getElementById("barangay") as HTMLInputElement).value
      );
      formData2.append(
        "city",
        (document.getElementById("city") as HTMLInputElement).value
      );
      formData2.append(
        "province",
        (document.getElementById("province") as HTMLInputElement).value
      );
      formData2.append(
        "isFamilyHead",
        (document.getElementById("isFamilyHead") as HTMLInputElement).value ==
          "on"
          ? "true"
          : "false"
      );
      formData2.append(
        "brgy_records",
        (document.getElementById("brgy_records") as HTMLInputElement).value
      );
      formData2.append(
        "member_count",
        (document.getElementById("member_count") as HTMLInputElement).value
      );
      formData2.append(
        "familyMonthlyIncome",
        (document.getElementById("family_income") as HTMLInputElement).value
      );

      if (response.ok) {
        formData2.append("image", uploadImage.secure_url);

        let formDataObject = {} as any;

        for (let [key, value] of formData2.entries() as any) {
          formDataObject[key] = value;
        }

        let jsonData = JSON.stringify(formDataObject);
        console.log(jsonData);
        const uploadToDB = await fetch("/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sesh.accessToken}`,
          },
          body: jsonData,
        });

        if (uploadToDB.ok) {
          const result = await uploadToDB.json();
          console.log(result);
          MySwal.fire({
            title: "Success!",
            text: "Record has been created!",
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }
        if (!response.ok) {
          MySwal.fire({
            title: "Error",
            text: "There has been an error saving your record",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    };
    upload();
  }
  return (
    <div className="">
      <div className="absolute w-full top-0 left-0  before:bg-black before:opacity-30 before:absolute before:top-0 before:left-0 before:w-screen before:h-full  ">
        <form
          method="post"
          onSubmit={handleOnSubmit}
          className="flex flex-col bg-white rounded-lg px-8 shadow-md mt-14 pb-10 relative z-10 w-1/2 mx-auto"
        >
          <div className="flex justify-between items-center border-b border-b-gray-300 pt-10 pb-5 mb-5">
            <h1 className="text-2xl font-Poppins font-semibold   ">
              Create Record
            </h1>
            <button
              className="text-4xl"
              onClick={() => {
                setShowAddModal(false);
              }}
            >
              &times;
            </button>
          </div>

          {/* Name */}
          <label
            className="text-lg font-Poppins font-normal"
            htmlFor="newFirstName"
          >
            First Name
          </label>
          <input
            placeholder="Ex. JUAN"
            className="bg-customWhite rounded-md border h-11 shadow-lg p-3"
            type="text"
            name="newFirstName"
            id="newFirstName"
          />

          <label
            className="text-lg font-Poppins font-normal"
            htmlFor="newLastName"
          >
            Last Name
          </label>
          <input
            placeholder="Ex. DELA CRUZ"
            className="bg-customWhite rounded-md border h-11 shadow-lg p-3"
            type="text"
            name="newLastName"
            id="newLastName"
          />

          <label
            className="text-lg font-Poppins font-normal"
            htmlFor="newMiddleName"
          >
            Middle Name
          </label>
          <input
            placeholder="Ex. SANTOS"
            className="bg-customWhite rounded-md border h-11 shadow-lg p-3"
            type="text"
            name="newMiddleName"
            id="newMiddleName"
          />

          <label className="text-lg font-Poppins font-normal" htmlFor="suffix">
            Suffix
          </label>
          <select
            className="font-Poppins h-11 bg-customWhite rounded-md border shadow-lg p-3"
            name="suffix"
            id="suffix"
          >
            <option className="font-Poppins" value="none">
              None
            </option>
            <option className="font-Poppins" value="Jr">
              Jr
            </option>
            <option className="font-Poppins" value="Sr">
              Sr
            </option>
            <option className="font-Poppins" value="III">
              III
            </option>
            <option className="font-Poppins" value="IV">
              IV
            </option>
            <option className="font-Poppins" value="V">
              V
            </option>
          </select>
          {/* birthdate */}
          <label
            htmlFor="birthDate"
            className="text-lg font-Poppins font-normal"
          >
            Birth Date
          </label>
          <input
            className="p-3 bg-customWhite shadow-lg rounded-md border"
            type="date"
            name="birthDate"
            id="birthDate"
          />
          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="text-lg font-Poppins font-normal"
            >
              Gender
            </label>
            <div className="flex gap-1">
              <input title="gender" type="radio" name="gender" value="male" />
              <p>Male</p>
            </div>
            <div className="flex gap-1">
              <input title="gender" type="radio" name="gender" value="female" />
              <p>Female</p>
            </div>
          </div>
          {/* Civil Status */}
          <label
            className="font-Poppins text-lg font-normal"
            htmlFor="civilStatus"
          >
            Civil Status
          </label>
          <select
            className="bg-customWhite border h-10 p-2 rounded-md shadow-lg"
            name="civilStatus"
            id="civilStatus"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
            <option value="divorced">Divorced</option>
          </select>
          {/* Occupation */}
          <label
            className="font-Poppins text-lg font-normal"
            htmlFor="occupation"
          >
            Occupation
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="text"
            name="occupation"
            id="occupation"
          />
          {/* Contact Info */}
          <label className="font-Poppins text-lg font-normal" htmlFor="email">
            Email
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="email"
            name="email"
            id="email"
          />
          <label
            className="font-Poppins text-lg font-normal"
            htmlFor="contactNumber"
          >
            Contact Number
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="number"
            name="contactNumber"
            id="contactNumber"
          />
          {/* Address */}
          <label className="font-Poppins text-lg font-normal" htmlFor="address">
            Address Line 1
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="text"
            name="address"
            id="address"
          />
          <label
            className="font-Poppins text-lg font-normal"
            htmlFor="address2"
          >
            Address Line 2
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="text"
            name="address2"
            id="address2"
          />
          <label
            className="font-Poppins text-lg font-normal"
            htmlFor="province"
          >
            Province
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="text"
            name="province"
            id="province"
          />
          <label className="font-Poppins text-lg font-normal" htmlFor="city">
            City
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="text"
            name="city"
            id="city"
          />
          <label
            className="font-Poppins text-lg font-normal"
            htmlFor="barangay"
          >
            Barangay
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="text"
            name="barangay"
            id="barangay"
          />
          {/* family information */}
          <div className="flex gap-4 mt-5">
            <label
              className="font-Poppins text-lg font-normal"
              htmlFor="isFamilyHead"
            >
              Are you the head of the family?
            </label>
            <input
              className=""
              type="checkbox"
              name="isFamilyHead"
              id="isFamilyHead"
              onClick={(e) => {
                if (e.currentTarget.checked) {
                  setIsFamilyHead(true);
                } else {
                  setIsFamilyHead(false);
                }
              }}
            />
          </div>
          {/* Family Details */}
          <div
            className={`grid grid-cols-2 gap-5 mb-5 transition-all duration-500 ease-in-out overflow-hidden ${
              isFamilyHead ? " h-auto " : "h-0"
            }`}
          >
            <div className="flex flex-col w-2/3">
              <label
                className="font-Poppins text-lg font-normal"
                htmlFor="member_count"
              >
                Family Member Count
              </label>

              <input
                className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
                type="text"
                name="member_count"
                id="member_count"
              />
            </div>
            <div className="flex flex-col w-2/3">
              <label
                className="font-Poppins text-lg font-normal"
                htmlFor="family_income"
              >
                Family Income
              </label>
              <input
                className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
                type="text"
                name="family_income"
                id="family_income"
              />
            </div>
          </div>
          {/* Records */}
          <label
            className="font-Poppins text-lg font-normal"
            htmlFor="brgy_records"
          >
            Barangay Records
          </label>
          <input
            className="bg-customWhite border h-10 p-3 rounded-md shadow-lg"
            type="text"
            name="brgy_records"
            id="brgy_records"
          />
          {/* Image */}
          <label
            className="font-Poppins text-lg font-normal mb-2"
            htmlFor="image"
          >
            Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleOnChange}
          />
          <button
            type="submit"
            className="bg-blue-500 w-full md:w-fit p-2 rounded-lg font-Poppins text-customWhite mt-5"
          >
            Submit
          </button>
        </form>
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
  } else {
    console.log(session);
    return { props: { sesh } };
  }
}
