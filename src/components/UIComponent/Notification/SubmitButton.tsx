/** @format */

import React, { ReactNode, memo, useEffect, useState } from "react";

import SuccessNotification from "../Notification/SuccessNotification";
import LoadingSpinnerSmall from "../Loading/LoadingSpinnerSmall";
import FailedNotification from "../Notification/FailedNotification";

interface SubmitButtonProps {
  icon?: ReactNode;
  name: string;
  classNames?: string;
  isLoading: boolean;
  isFormValid: boolean;
  onClick: () => void;
  successMessage?: string;
  errorMessage?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  icon,
  name,
  isLoading,
  isFormValid,
  onClick,
  successMessage,
  errorMessage,
  classNames,
}) => {
  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <button
            type="submit"
            className={`${classNames}  rounded-lg flex justify-center border-2 bg-blue-700 px-3 py-2 text-xs font-medium uppercase  text-white ${
              isFormValid ? " hover:bg-blue-800" : ""
            }  focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50`}
            disabled={!isFormValid || isLoading}
            onClick={onClick}>
            {isLoading ? (
              <>
                {" "}
                <LoadingSpinnerSmall /> <span className="ml-2">Processing</span>
              </>
            ) : (
              <span className="flex space-x-2">
                {icon && <span className="my-auto"> {icon}</span>}
                <span className="my-auto"> {name}</span>
              </span>
            )}
          </button>
        </div>
        <div className=" w-full">
          {successMessage && <SuccessNotification message={successMessage} />}
          {errorMessage && (
            <>
              <FailedNotification message={errorMessage} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SubmitButton;
