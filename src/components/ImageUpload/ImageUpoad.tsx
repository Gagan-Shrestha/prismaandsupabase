"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createData } from "./ImageUploadServer";

const ImageUpoad: React.FC = () => {
  const [addData, setAddData] = useState({
    email: "",
    password: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const queryClient = useQueryClient();
  const { mutateAsync: addAllData } = useMutation({
    mutationFn: createData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data"] });
    },
  });

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log(`File selected: ${selectedFile.name}`);
      setPhotoFile(selectedFile);
    } else {
      setPhotoFile(null);
    }
  };
  const handleSave = async (event: any) => {
    const formData = new FormData();
    const dataToPass = JSON.stringify(addData);
    formData.append("simpleData", dataToPass);
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    if (Object.values(addData).every((value) => value)) {
      try {
        await addAllData(formData);

        setAddData({
          email: "",
          password: "",
        });
      } catch (error) {
        console.error("Error saving practice trial:", error);
      }
    } else {
      console.log("All fields are required.");
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="email" className="mb-1 block"></label>
        <input
          type="email"
          id="email"
          name="email"
          value={addData.email}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block">password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={addData.password}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block">photo</label>
        <input
          type="file"
          id="photo"
          name="photo"
          onChange={handleFileChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>
      <button
        type="submit"
        onClick={handleSave}
        className="mt-5 h-11 w-44 rounded-3xl border-2 bg-blue-400 text-sm font-medium uppercase text-white"
      >
        Save
      </button>
    </div>
  );
};

export default ImageUpoad;
