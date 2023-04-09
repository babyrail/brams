import { useState } from "react";
import cloudinary from "next-cloudinary";
export default function CreateRecord() {
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
    console.log("qweqwe");
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
      formData2.append("firstName", document.getElementById("firstName").value);
      formData2.append("lastName", document.getElementById("lastName").value);
      formData2.append(
        "middleName",
        document.getElementById("middleName").value
      );
      formData2.append(
        "houseNumber",
        parseInt(document.getElementById("houseNumber").value)
      );
      formData2.append("purok_ST", document.getElementById("purok_ST").value);
      formData2.append("blk", parseInt(document.getElementById("blk").value));
      formData2.append(
        "isFamilyHead",
        document.getElementById("isFamilyHead").value == "on" ? false : true
      );
      formData2.append(
        "brgy_records",
        document.getElementById("brgy_records").value
      );
      formData2.append(
        "familyID",
        parseInt(document.getElementById("familyID").value)
      );

      if (response.ok) {
        formData2.append("image", uploadImage.secure_url);

        let formDataObject = {};

        for (let [key, value] of formData2.entries()) {
          formDataObject[key] = value;
        }

        let jsonData = JSON.stringify(formDataObject);

        console.log(jsonData);
        const uploadToDB = await fetch("/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      <h1>Create Record</h1>
      <form method="post" onSubmit={handleOnSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input type="text" name="firstName" id="firstName" />
        <label htmlFor="lastName">Last Name</label>
        <input type="text" name="lastName" id="lastName" />
        <label htmlFor="middleName">Middle Name</label>
        <input type="text" name="middleName" id="middleName" />
        <label htmlFor="houseNumber">House Number</label>
        <input type="number" name="houseNumber" id="houseNumber" />
        <label htmlFor="purok_ST">Purok/Street</label>
        <input type="text" name="purok_ST" id="purok_ST" />
        <label htmlFor="blk">Block</label>
        <input type="number" name="blk" id="blk" />
        <label htmlFor="isFamilyHead">Are you the head of the family?</label>
        <input type="checkbox" name="isFamilyHead" id="isFamilyHead" />
        <label htmlFor="brgy_records">Barangay Records</label>
        <input type="text" name="brgy_records" id="brgy_records" />
        <label htmlFor="familyID">Family ID</label>
        <input type="number" name="familyID" id="familyID" />
        <label htmlFor="image">Image</label>
        <input type="file" name="image" id="image" onChange={handleOnChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
