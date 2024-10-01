/** @format */
"use client";
import React, {
  useState,
  ChangeEvent,
  ReactNode,
  memo,
  useEffect,
  MouseEvent,
} from "react";

import DOMPurify from "isomorphic-dompurify";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLock,
} from "react-icons/ai";
// Define your types using Zod

interface TextInputProps {
  type: "email" | "text" | "phone" | "number" | "password";
  classNames?: string;
  name?: string;
  values?: string;
  icon?: ReactNode;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  clearOnSuccess?: boolean;
}

function TextInputPlain({
  type,
  name,
  classNames,
  placeholder,
  label,
  values,
  icon,
  onChange,
  required = false,
  clearOnSuccess = false,
  disabled = false,
}: TextInputProps) {
  const [value, setValue] = useState<string>(values || "");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    if (inputValue === "") {
      setValue("");
      if (onChange) {
        onChange("");
      }
      setError("");
      return;
    }

    validateInput(inputValue);
  };

  const validateInput = (inputValue: string) => {
    if (inputValue === "") {
      setValue("");
      setError("");
    } else {
      const sanitizedValue = DOMPurify.sanitize(inputValue);

      setError(null);
      setValue(inputValue);
      if (onChange) {
        onChange(sanitizedValue);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (clearOnSuccess) {
      setValue("");
    }
  }, [clearOnSuccess]);

  return (
    <div>
      {label && (
        <label
          htmlFor={name || label}
          className={`block mb-2  ${
            classNames || ""
          } font-medium text-gray-900 dark:text-white`}>
          {label}
        </label>
      )}
      {type === "password" ? (
        <div className="relative flex items-center">
          {icon}
          <input
            type={showPassword ? "text" : "password"}
            id={name || label}
            name={name || label}
            placeholder={placeholder}
            value={values !== undefined ? values : value}
            required={required}
            disabled={disabled}
            onChange={handleChange}
            className={`bg-gray-50 border ${
              icon ? "pl-10" : ""
            } border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${classNames || ""}`}
          />
          <div
            className="absolute right-4 flex items-center"
            onClick={(e) => togglePasswordVisibility(e)}>
            {showPassword ? (
              <AiOutlineEyeInvisible
                size={16}
                color="grey"
                className="cursor-pointer"
              />
            ) : (
              <AiOutlineEye size={16} color="grey" className="cursor-pointer" />
            )}
          </div>
        </div>
      ) : (
        <div className="relative flex items-center ">
          {icon}
          <input
            type={type}
            id={name || label}
            name={name || label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={values !== undefined ? values : value}
            onChange={handleChange}
            className={`bg-gray-50 border ${
              icon ? "pl-10" : ""
            } border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${classNames || ""}`}
          />
        </div>
      )}
    </div>
  );
}

export default memo(TextInputPlain);
