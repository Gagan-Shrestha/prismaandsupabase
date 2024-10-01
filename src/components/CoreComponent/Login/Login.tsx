/** @format */

"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import { signIn } from "next-auth/react";

import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image";
import SubmitButton from "@/components/UIComponent/Notification/SubmitButton";
import LoadingComponent from "@/components/UIComponent/Loading/LoadingComponent";

interface SignInData {
  userEmail: string;
  userPassword: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [userData, setUserData] = useState<SignInData>({
    userEmail: "",
    userPassword: "",
  });
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignInClick = async () => {
    setIsLoading(true);
    try {
      if (userData?.userEmail && userData?.userPassword) {
        const loginData = {
          login: userData?.userEmail, // Can be email or phone
          password: userData?.userPassword,
          callbackUrl: "/login",
          redirect: true,
        };

        const login = await signIn("credentials", loginData);
        // console.log("login", login);

        if (login?.ok && login?.url) {
          router.push(login?.url);
          setIsLoading(false);
          setIsFormValid(false);
          setIsAuthenticated(true);
        } else if (login?.error) {
          setErrorMessage(login.error);
          if (login.error === "Not Verified") {
            router.push("/login");
          }
          setIsLoading(false);
        }
      } else {
        setErrorMessage("Please enter valid email or phone and password");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setIsLoading(false);
    }
  };
  const handleGoBack = () => {
    router.push("/");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      setErrorMessage(error);
    }
  }, []);
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000); // Hide the alert after 5 seconds

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [successMessage, errorMessage]);
  return (
    <div>
      {!isAuthenticated ? (
        <>
          <div className="flex min-h-screen bg-gray-100">
            <div className="absolute left-0 top-0 p-3">
              <button className="" onClick={handleGoBack}>
                <IoMdArrowBack className=" text-xl font-bold md:hidden block text-blue-700 md:text-white hover:text-blue-800" />
              </button>
            </div>
            <div className=" w-1/2 md:flex hidden bg-white flex-col justify-center items-center ">
              <div className=" p-2 text-center">
                <div className=" text-center w-full  flex justify-center">
                  <div className="h-32 w-32 mb-4 ">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={1000}
                      height={1000}
                    />
                  </div>
                </div>
                <h1 className="text-black text-3xl mb-2">
                  Asset Management System
                </h1>
              </div>
            </div>
            <div className="flex md:w-1/2 w-full bg-grey-200 p-8 flex-col justify-center items-center">
              <div className="md:hidden text-center w-full flex justify-center">
                <div className="h-32 w-32 ">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={1000}
                    height={1000}
                  />
                </div>
              </div>
              <p className="mt-2 text-sm mb-4 block md:hidden leading-relaxed text-gray-900 text-center">
                "No Account"
                <Link href="/register">
                  <span className="font-bold bg-blue-700 rounded-full px-2 py-1.5 hover:bg-blue-800 p-2 text-white">
                    "Register Here"
                  </span>
                </Link>
              </p>
              <div className="w-full max-w-md p-4 sm:p-7 bg-blue-800 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold dark:text-white text-white">
                    Log In
                  </h1>
                </div>
                <div className="mt-5">
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm mb-2 dark:text-white text-white"
                      >
                        Email or Phone
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          required
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              userEmail: e.target.value,
                            })
                          }
                          aria-describedby="email-error"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="password"
                          className="block text-sm mb-2 dark:text-white text-white"
                        >
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          required
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              userPassword: e.target.value,
                            })
                          }
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="focus:outline-none"
                          >
                            {showPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-4"
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
                                className="size-4"
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
                    </div>
                    <Link
                      className="text-sm text-white decoration-2  font-medium "
                      href="/forgotpassword"
                    >
                      Forgot password?
                    </Link>
                    <SubmitButton
                      name={"Login"}
                      classNames="w-full mt-4 py-3 px-4 inline-flex justify-center  bg-red-600 items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent  text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
                      isLoading={isLoading} // Pass the isLoading state
                      isFormValid={isFormValid} // Pass the isFormValid state
                      onClick={handleSignInClick} // Pass the handleSubmit function
                      successMessage={successMessage} // Pass the success message
                      errorMessage={errorMessage} // Pass the errorMessage state
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default Login;
