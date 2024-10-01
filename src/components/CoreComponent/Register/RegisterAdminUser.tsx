/** @format */

"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { IoMdArrowBack } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";

import Image from "next/image";
import Link from "next/link";

import { registerAdmin } from "./registerAdmin";
import SubmitButton from "@/components/UIComponent/Notification/SubmitButton";

const RegistrationAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    role: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleRegisterClick = async () => {
    setIsLoading(true);
    if (userData?.adminEmail && userData?.adminPassword) {
      setIsLoading(true);
      console.log("ud", userData);
      try {
        const dataToSend = {
          adminEmail: userData?.adminEmail,
          adminPhone: userData?.adminPhone,
          adminPassword: userData?.adminPassword,
          name: userData?.name,
        };
        const data = await registerAdmin(JSON.stringify(dataToSend));
        if (data?.error) {
          setErrorMessage(data?.error);
          setIsLoading(false);
        } else if (data?.success) {
          setSuccessMessage(data?.success);
          setTimeout(() => {
            router.push("/login");
          }, 3000);

          setIsLoading(false);
        } else {
          router.push("/login");
          resetForm();
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setErrorMessage("Failed to register user");
      }
    } else {
      setErrorMessage("Please enter valid input");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let timer: any;

    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } else if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);
  const resetForm = () => {
    setUserData({
      name: "",
      adminEmail: "",
      adminPhone: "",
      adminPassword: "",
      role: "",
    });
  };

  const handleRoleChange = (e: any) => {
    const newRole = e.target.value;
    resetForm();
    setUserData((prevState) => ({ ...prevState, role: newRole }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };
  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <div className="absolute left-0 top-0 p-3">
        <button className="" onClick={handleGoBack}>
          <IoMdArrowBack className=" text-xl font-bold md:hidden block text-blue-700 md:text-white hover:text-blue-800" />
        </button>
      </div>
      <div className=" w-1/2 md:flex hidden bg-white flex-col justify-center items-center ">
        <div className=" p-2 text-center">
          <div className=" text-center w-full  flex justify-center">
            <div className="h-32 w-32 mb-4 ">
              <Image src="/logo.png" alt="Logo" width={1000} height={1000} />
            </div>
          </div>
          <h1 className="text-black text-3xl mb-2">Asset Management System</h1>
        </div>
      </div>
      <div className="flex md:w-1/2 w-full  bg-blue-800 p-8 flex-col justify-center items-center">
        <div className="md:hidden  text-center w-full  flex justify-center">
          <div className="h-32 w-32 mb-4 ">
            <Image src="/logo.png" alt="Logo" width={1000} height={1000} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Register Admin User
        </h1>
        <div className="w-full max-w-md">
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm mb-2 text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="py-2 px-3 border border-gray-300 rounded-lg w-full"
                value={userData?.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                required
              />
            </div>
            <>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 text-white"
                >
                  email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`py-2 px-3 border ${
                    userData?.adminEmail && !isValidEmail(userData?.adminEmail)
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg w-full`}
                  value={userData?.adminEmail}
                  onChange={(e) =>
                    setUserData({ ...userData, adminEmail: e.target.value })
                  }
                  required
                />
                {userData?.adminEmail &&
                  !isValidEmail(userData?.adminEmail) && (
                    <p className="text-red-300 text-sm mt-1">
                      "Please enter a valid email address"
                    </p>
                  )}
              </div>
            </>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="py-2 px-3 border border-gray-300 rounded-lg w-full"
                  value={userData?.adminPassword}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      adminPassword: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <SubmitButton
              name="Register"
              classNames="w-full mt-6 py-3 px-4 inline-flex justify-center  bg-red-600 items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent  text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
              isLoading={isLoading} // Pass the isLoading state
              isFormValid={true} // Pass the isFormValid state
              onClick={handleRegisterClick} // Pass the handleVerificationPageClick function
              successMessage={successMessage} // Pass the success message
              errorMessage={errorMessage} // Pass the errorMessage state
            />

            {errorMessage && (
              <div
                className="mt-3 flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className=" flex w-full space-x-2 rounded-md bg-red-600 p-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-white" />
                  <p className="text-sm text-white">{errorMessage}</p>
                </span>
              </div>
            )}
            {successMessage && (
              <div
                className="mt-7 flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className=" flex w-full space-x-2 rounded-md bg-blue-600 p-2">
                  <p className="text-sm text-white">{successMessage}</p>
                </span>
              </div>
            )}
          </>

          <div>
            <button className="bg-white text-red-500 border-red-500     text-xs p-3 rounded-lg mt-2 w-full  font-bold flex items-center justify-center space-x-2">
              <Link href={"/login"} className="flex items-center space-x-2">
                <FaArrowLeft />
                <span>Login</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationAdmin;
