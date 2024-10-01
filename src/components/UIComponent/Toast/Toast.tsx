/** @format */
"use client";
import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error"; // Specify the type as 'success' or 'error'
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(true);
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000); // Hide the alert after 5 seconds

    return () => {
      clearTimeout(timeout);
    };
  }, [message]);

  return (
    showAlert && (
      <div className="fixed right-4 top-4 z-50  h-fit md:w-96 w-72">
        <div
          className={`rounded-lg border-t-2 p-4 ${
            type == "success"
              ? " border-teal-500 bg-teal-50  dark:bg-teal-800/30"
              : " border-red-500 bg-red-50  dark:bg-red-800/30"
          }`}
          role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-4 ${
                  type == "success"
                    ? "border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400"
                    : "border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-teal-800 dark:text-red-400"
                } `}>
                {type == "success" ? (
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </span>
            </div>
            <div className="ms-3">
              {type == "success" ? (
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Success
                </h3>
              ) : (
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Error
                </h3>
              )}

              <p className="w-fit max-w-xs break-words text-sm text-gray-700 dark:text-gray-400">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export const successToast = (message: string): JSX.Element => {
  return <Toast message={message} type="success" />;
};

export const errorToast = (message: string): JSX.Element => {
  return <Toast message={message} type="error" />;
};
