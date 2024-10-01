'use client';
import React, { useEffect } from 'react';

interface SuccessAlertProps {
  message: string;
  showAlert: boolean;
  type: string;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}
const DismissAlert: React.FC<SuccessAlertProps> = ({
  message,
  showAlert,
  type,
  setShowAlert,
}) => {
  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Hide the alert after 3 seconds

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showAlert, setShowAlert]);
  return (
    showAlert && (
      <div className="fixed right-4 top-4 z-50  h-fit w-96">
        <div
          id="dismiss-alert"
          className={`rounded-lg border  p-4 text-sm  transition duration-300 ${
            type == 'success'
              ? 'border-teal-200 bg-teal-50 text-teal-800  dark:border-teal-900 dark:bg-teal-800/10 dark:text-teal-500'
              : 'border-red-200 bg-red-50 text-red-800  dark:border-red-900 dark:bg-red-800/10 dark:text-red-500'
          } `}
          role="alert"
        >
          <div className="flex">
            <div className="my-auto flex-shrink-0">
              <svg
                className={`h-4 w-4 flex-shrink-0 ${
                  type == 'success' ? 'text-blue-600' : 'text-red-800'
                } `}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="ms-2">
              <div className="text-sm font-medium">{message}</div>
            </div>
            <div className="ms-auto ps-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={`inline-flex rounded-lg  p-1.5 focus:outline-none focus:ring-2 dark:bg-transparent ${
                    type == 'success'
                      ? 'border-teal-200 bg-teal-50 text-teal-800  dark:border-teal-900 dark:bg-teal-800/10 dark:text-teal-500'
                      : 'border-red-200 bg-red-50 text-red-800  dark:border-red-900 dark:bg-red-800/10 dark:text-red-500'
                  } `}
                  onClick={() => setShowAlert(false)}
                  data-hs-remove-element="#dismiss-alert"
                >
                  <span className="sr-only">Dismiss</span>
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
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DismissAlert;
