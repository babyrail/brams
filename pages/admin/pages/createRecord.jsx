import { useState } from "react";
import cloudinary from "next-cloudinary";
import { getSession, useSession } from "next-auth/react";

export default function CreateRecord({ sesh }) {
  const [file, setFile] = useState(null);
  function handleOnChange() {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFile(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleOnSubmit() {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
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
      let gender = document.querySelector('input[name="gender"]:checked').value;
      formData2.append(
        "firstName",
        document.getElementById("firstName").value.toUpperCase()
      );
      formData2.append(
        "lastName",
        document.getElementById("lastName").value.toUpperCase()
      );
      formData2.append(
        "middleName",
        document.getElementById("middleName").value.toUpperCase()
      );
      formData2.append(
        "suffix",
        document.getElementById("suffix").value.toUpperCase()
      );
      formData2.append("birthDate", document.getElementById("birthDate").value);
      formData2.append("gender", gender.toUpperCase());
      formData2.append(
        "civilStatus",
        document.getElementById("civilStatus").value.toUpperCase()
      );
      formData2.append(
        "occupation",
        document.getElementById("occupation").value.toUpperCase()
      );
      formData2.append("email", document.getElementById("email").value);
      formData2.append(
        "contactNumber",
        document.getElementById("contactNumber").value
      );
      formData2.append(
        "addressLine1",
        document.getElementById("address").value
      );
      if (document.getElementById("address2").value != "") {
        formData2.append(
          "addressLine2",
          document.getElementById("address2").value
        );
      }
      formData2.append("barangay", document.getElementById("barangay").value);
      formData2.append("city", document.getElementById("city").value);
      formData2.append("province", document.getElementById("province").value);
      formData2.append(
        "isFamilyHead",
        document.getElementById("isFamilyHead").value == "on" ? false : true
      );
      formData2.append(
        "brgy_records",
        document.getElementById("brgy_records").value.toUpperCase()
      );

      if (response.ok) {
        formData2.append("image", uploadImage.secure_url);

        let formDataObject = {};

        for (let [key, value] of formData2.entries()) {
          formDataObject[key] = value;
        }

        let jsonData = JSON.stringify(formDataObject);

        const uploadToDB = await fetch("../../api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sesh.accessToken}`,
          },
          body: jsonData,
        });
        const result = await uploadToDB.json();
        console.log(result);
      }
    };
    upload();
  }
  return (
    <>
      <div className="container mx-auto ">
        <h1>Create Record</h1>
        <form method="post" onSubmit={handleOnSubmit} className="flex flex-col">
          {/* Name */}
          <label htmlFor="firstName">First Name</label>
          <input type="text" name="firstName" id="firstName" />

          <label htmlFor="lastName">Last Name</label>
          <input type="text" name="lastName" id="lastName" />

          <label htmlFor="middleName">Middle Name</label>
          <input type="text" name="middleName" id="middleName" />

          <label htmlFor="suffix">Suffix</label>
          <select name="suffix" id="suffix">
            <option value="none">None</option>
            <option value="Jr">Jr</option>
            <option value="Sr">Sr</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
          </select>
          {/* birthdate */}
          <label htmlFor="birthDate">Birth Date</label>
          <input type="date" name="birthDate" id="birthDate" />
          {/* Gender */}
          <div>
            <div className="flex gap-1">
              <input type="radio" name="gender" value="male" />
              <p>Male</p>
            </div>
            <div className="flex gap-1">
              <input type="radio" name="gender" value="female" />
              <p>Female</p>
            </div>
          </div>
          {/* Civil Status */}
          <label htmlFor="civilStatus">Civil Status</label>
          <select name="civilStatus" id="civilStatus">
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
            <option value="divorced">Divorced</option>
          </select>
          {/* Occupation */}
          <label htmlFor="occupation">Occupation</label>
          <input type="text" name="occupation" id="occupation" />
          {/* Contact Info */}
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          <label htmlFor="contactNumber">Contact Number</label>
          <input type="number" name="contactNumber" id="contactNumber" />
          {/* Address */}
          <label htmlFor="address">Address Line 1</label>
          <input type="text" name="address" id="address" />
          <label htmlFor="address2">Address Line 2</label>
          <input type="text" name="address2" id="address2" />
          <label htmlFor="province">Province</label>
          <input type="text" name="province" id="province" />
          <label htmlFor="city">City</label>
          <input type="text" name="city" id="city" />
          <label htmlFor="barangay">Barangay</label>
          <input type="text" name="barangay" id="barangay" />
          {/* family information */}
          <label htmlFor="isFamilyHead">Are you the head of the family?</label>
          <input type="checkbox" name="isFamilyHead" id="isFamilyHead" />
          {/* Records */}
          <label htmlFor="brgy_records">Barangay Records</label>
          <input type="text" name="brgy_records" id="brgy_records" />
          {/* Image */}
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleOnChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
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
