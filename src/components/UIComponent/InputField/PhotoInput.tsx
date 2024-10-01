/** @format */

import Image from "next/image";
import React, { memo, useEffect, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import Compressor from "compressorjs";

interface PhotoInputProps {
  label?: string;
  values?: File | null;
  allowedExtensions: string[];
  onFileSelected: (file: File) => void;
  clearOnSuccess?: boolean;
}

const PhotoInput: React.FC<PhotoInputProps> = ({
  label,
  values,
  onFileSelected,
  allowedExtensions,
  clearOnSuccess,
}) => {
  const [isInputVisible, setInputVisible] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSvgClick = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    if (values instanceof File) {
      setSelectedPhoto(URL.createObjectURL(values));
    }
    if (clearOnSuccess) {
      setSelectedPhoto(null);
    }
  }, [values, clearOnSuccess]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(extension || "")) {
        setErrorMessage(
          `Invalid file type. Allowed types are: ${allowedExtensions.join(
            ", "
          )}.`
        );
      } else if (file.size > 20 * 1024 * 1024) {
        setErrorMessage(
          "File size exceeds 20 MB. Please choose a smaller file."
        );
      } else {
        setErrorMessage(null);

        // Compress the image file
        new Compressor(file, {
          quality: 0.75,
          success(compressedFile) {
            const reader = new FileReader();
            reader.onload = () => {
              setSelectedPhoto(reader.result as string);
              setInputVisible(false);
            };
            reader.readAsDataURL(compressedFile);
            onFileSelected(compressedFile as File);
          },
          error(err) {
            console.error("Compression error:", err.message);
          },
        });
      }
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setErrorMessage(null);
  };

  return (
    <div className="px-2 w-full">
      <div className="border p-2 w-full">
        {label && <p className="mb-2 text-sm font-semibold">{label}</p>}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="relative flex flex-col items-center justify-center w-48 h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            {selectedPhoto ? (
              <>
                <Image
                  src={selectedPhoto}
                  alt="Uploaded Photo"
                  className="w-32 h-32 object-contain rounded-lg"
                  width={1000}
                  height={1000}
                />
                <FaTimesCircle
                  className="absolute top-2 right-2 cursor-pointer text-red-500 text-lg"
                  onClick={handleRemovePhoto}
                />
              </>
            ) : (
              <div
                className="flex flex-col items-center justify-center pt-5 pb-6"
                onClick={handleSvgClick}>
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  (Max size 5MB)
                </p>
              </div>
            )}
            {isInputVisible && (
              <>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {errorMessage && (
                  <p className="text-xs w-full px-2 text-center text-red-500">
                    {errorMessage}
                  </p>
                )}
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default PhotoInput;
