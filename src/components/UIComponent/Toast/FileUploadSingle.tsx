/** @format */

import React, { memo, useRef, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";

interface FileUploadProps {
  label?: string;
  allowedTypes: string[];
  onFileSelected: (file: File | null) => void;
}

const FileUploadSingle: React.FC<FileUploadProps> = ({
  label,
  allowedTypes,
  onFileSelected,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // Check if the selected file has an allowed file extension
    if (
      file &&
      allowedTypes.some((type: any) =>
        new RegExp(`${type}$`, "i").test(file.name)
      )
    ) {
      // Check if the file size exceeds 500 KB
      if (file.size > 500 * 1024) {
        setErrorMessage(
          "File size exceeds 500 KB. Please choose a smaller file."
        );
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setErrorMessage(null);
        onFileSelected(file); // Pass the selected file to the parent component
      }
    } else {
      setSelectedFile(null);
      setErrorMessage(
        `Invalid file type. Please select a file with the following extensions: ${allowedTypes.join(
          ", "
        )}.`
      );
      onFileSelected(null); // Pass null to the parent component for an invalid file
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);

    // Reset the value of the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onFileSelected(null); // Pass null to the parent component to indicate file removal
  };

  return (
    <div>
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="small_size"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={fileInputRef}
          className="block w-full text-xs text-gray-500 border rounded-lg border-blue-700
        file:me-4 file:py-2 file:px-4 hover:border-blue-700
        file:rounded-lg file:border-0
        file:text-xs file:font-semibold
        file:bg-blue-600 file:text-white
        hover:file:bg-blue-700
        file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:file:bg-blue-500
        dark:hover:file:bg-blue-400"
          type="file"
          accept={allowedTypes.map((type: any) => `.${type}`).join(", ")}
          onChange={handleFileChange}
        />
        {selectedFile && (
          <FaTimesCircle
            className="absolute top-2 right-2 cursor-pointer text-red-500 text-lg"
            onClick={handleRemoveFile}
          />
        )}
      </div>
      {errorMessage && (
        <p className="text-xs px-2 pt-1 text-red-500">{errorMessage}</p>
      )}
      {/* {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
     
        </div>
      )} */}
    </div>
  );
};

export default memo(FileUploadSingle);

// Implementation

// const handleFileSelected = (file: File | null) => {
//   // Do something with the selected file or handle the file removal
//   //console.log("Selected File:", file);
// };

// <FileUploadSingle
// label="Hello"
// onFileSelected={handleFileSelected}
// allowedTypes={["pdf", "doc", "docx"]}
// />
