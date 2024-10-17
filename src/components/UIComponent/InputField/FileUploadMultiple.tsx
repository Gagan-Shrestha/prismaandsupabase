/** @format */

import React, { useState, useRef, memo } from "react";
import { FaTimesCircle } from "react-icons/fa";

interface FileUploadMultipleProps {
  label: string;
  allowedTypes: string[];
  onFilesSelected: (files: File[] | null) => void;
}

const FileUploadMultiple: React.FC<FileUploadMultipleProps> = ({
  label,
  allowedTypes,
  onFilesSelected,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files || null;

    if (files && files.length > 0) {
      const filesArray = Array.from(files);

      const isValidFiles = filesArray.every((file) =>
        allowedTypes.some((type) => new RegExp(`${type}$`, "i").test(file.name))
      );

      const isFileSizeValid = filesArray.every(
        (file) => file.size <= 5 * 1024 * 1024
      );

      if (isValidFiles && isFileSizeValid) {
        const duplicates = filesArray.filter((file) =>
          selectedFiles.some((existingFile) => existingFile.name === file.name)
        );

        if (duplicates.length > 0) {
          setErrorMessage(
            `Duplicate files detected: ${duplicates
              .map((file) => file.name)
              .join(", ")}. Please select unique files.`
          );
        } else {
          const newSelectedFiles = [...selectedFiles, ...filesArray];
          setSelectedFiles(newSelectedFiles);
          onFilesSelected(newSelectedFiles);
          setErrorMessage(null);
        }
      } else {
        onFilesSelected(null);
        setErrorMessage(
          `Invalid file type or size. Please select files with the following extensions: ${allowedTypes.join(
            ", "
          )} and ensure the size is below 1MB for each file.`
        );
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles.length > 0 ? updatedFiles : null);
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]);
    setErrorMessage(null);
    onFilesSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input">
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
          id="file_input"
          type="file"
          accept={allowedTypes.map((type) => `.${type}`).join(", ")}
          multiple
          onChange={handleFileChange}
        />
        {selectedFiles.length > 0 && (
          <FaTimesCircle
            className="absolute top-2 right-2 cursor-pointer text-red-500 text-lg"
            onClick={handleRemoveAllFiles}
          />
        )}
      </div>

      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

      {selectedFiles.length > 0 && (
        <div className=" text-xs border p-2 rounded mt-1 mx-2">
          <p>Selected Files:</p>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index} className=" flex justify-between px-2 ">
                <span className=" truncate "> {file.name}</span>
                <FaTimesCircle
                  className="cursor-pointer text-red-500 text-lg ml-2"
                  onClick={() => handleRemoveFile(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(FileUploadMultiple);
