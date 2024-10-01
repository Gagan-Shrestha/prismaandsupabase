/** @format */

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import SubmitButton from "@/src/Components/UIComponents/Button/SubmitButton";
import LoadingComponent from "@/src/Components/UIComponents/Loading/LoadingComponent";
import { useLanguage } from "@/src/utils/providers/LanguageProvider";
import { IoMdArrowBack } from "react-icons/io";
import { verifyUser } from "@/src/Components/CoreComponent/Register/registerAdmin";

interface VerificationPageData {
  verificationCode: string;
}

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const { langData } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [userData, setUserData] = useState<VerificationPageData>({
    verificationCode: "",
  });

  const router = useRouter();

  const handleVerificationPageClick = async () => {
    setIsLoading(true);
    try {
      const userToken = searchParams.get("token") || "";
      const verify = await verifyUser(userToken);
      console.log("verify", verify);

      if (verify?.success) {
        setSuccessMessage(
          langData?.auth?.emailVerifiedSuccess || "Email verified successfully."
        );
        setIsLoading(false);
        setIsFormValid(false);
        router.push("/login");
      } else if (verify?.error) {
        setErrorMessage(verify.error);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(
        langData?.errors?.unexpectedError || "An unexpected error occurred"
      );
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000); // Hide the alert after 5 seconds

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [successMessage, errorMessage]);
  return (
    <div>
      <>
        <div className="flex min-h-screen bg-gray-100">
          <div className="absolute left-0 top-0 p-3">
            <button className="" onClick={handleGoBack}>
              <IoMdArrowBack className=" text-xl font-bold md:hidden block text-blue-700 md:text-white hover:text-blue-800" />
            </button>
          </div>
          <div className="w-1/2 md:flex hidden bg-green-600 flex-col justify-center items-center">
            <div className="p-2 text-center">
              <div className="text-center w-full flex justify-center">
                <img
                  src="/Images/sahidlakhhan.png"
                  alt="Logo"
                  className="h-32 mb-4"
                />
              </div>
              <h1 className="text-white text-3xl mb-2">
                {langData?.officeName || "शहीद लखन गाउँपालिका"}
              </h1>
              <h2 className="text-white text-2xl">
                {langData?.farmerPortal || "किसान चौतारी"}
              </h2>
            </div>
          </div>
          <div className="flex md:w-1/2 w-full bg-white p-8 flex-col justify-center items-center">
            <div className="md:hidden text-center w-full flex justify-center">
              <img
                src="/Images/sahidlakhhan.png"
                alt="Logo"
                className="h-32 mb-4"
              />
            </div>
            <div className="w-full max-w-md p-4 sm:p-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  {langData?.auth?.verifyEmail || "Verify Email"}
                </h1>
              </div>
              <div className="mt-5">
                <div className="grid gap-y-4">
                  <SubmitButton
                    name={langData?.auth?.verifyEmail || "Verify Email"}
                    classNames="w-full mt-6 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    isLoading={isLoading} // Pass the isLoading state
                    isFormValid={isFormValid} // Pass the isFormValid state
                    onClick={handleVerificationPageClick} // Pass the handleVerificationPageClick function
                    successMessage={successMessage} // Pass the success message
                    errorMessage={errorMessage} // Pass the errorMessage state
                  />
                  <p className="mt-2 block text-sm leading-relaxed text-gray-900 text-center">
                    {langData?.auth?.rememberPassword ||
                      "Remembered your password? "}{" "}
                    <Link href="/login">
                      <span className="font-bold bg-blue-700 rounded-full px-2 py-1.5 hover:bg-blue-800 p-2 text-white">
                        {langData?.auth?.login || "Login"}
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default VerificationPage;
