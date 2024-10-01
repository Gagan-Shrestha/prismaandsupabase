/** @format */

import { ReactNode, useState } from "react";

interface ModalProps {
  buttonName: string;
  buttonType: string;
  buttonMessage: string;
  icon?: ReactNode;
  userId: any;
  classNames?: string;
  handleConfirm: (userId: any) => void;
}

const ConfirmButton: React.FC<ModalProps> = ({
  buttonName,
  buttonType,
  buttonMessage,
  icon,
  userId,
  classNames,
  handleConfirm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = () => {
    // On button click, open the modal and perform action for the specific user
    setIsModalOpen(false);
    handleConfirm(userId); // Pass the userId to the handleConfirm function
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`mx-1 inline-flex items-center  gap-x-2 rounded ${
          buttonType === "Confirm"
            ? "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            : "bg-red-700 hover:bg-red-800  focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        }  px-2 py-1 text-center flex justify-center  font-medium text-white focus:outline-none focus:ring-4 `}
      >
        {icon}
        {buttonName}
      </button>
      <div
        tabIndex={-1}
        className={`fixed inset-0 z-50 flex text-base items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-200 bg-opacity-80 p-4 md:inset-0 ${
          isModalOpen ? "block" : "hidden"
        } `}
      >
        <div className="relative m-auto max-h-full max-w-md ">
          <div className="relative w-full rounded-lg bg-white shadow dark:bg-gray-700">
            {/* Modal content */}
            <button
              type="button"
              className="absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <svg
                className="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="mt-6 p-4 text-center md:p-10">
              {" "}
              <div>
                {/* Add any content you want to display in the modal */}
                <h3 className="mb-5  text-black text-base dark:text-gray-400">
                  {buttonMessage}
                </h3>
                <button
                  onClick={handleClick}
                  className="me-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-center text-base  font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                  type="button"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmButton;

// Implemnettaion

{
  /* <ConfirmButton
buttonMessage="Please confirm to setup account"
buttonName="Verify"
buttonType="Confirm"
handleConfirm={verifyUser}
userId={user.userId} // Pass the userId prop here
/>
<ConfirmButton
buttonMessage="Do you want to reject school?"
buttonName="Reject"
buttonType="Other"
handleConfirm={openRejectModal}
userId={user.userId} // Pass the userId prop here
/> */
}
