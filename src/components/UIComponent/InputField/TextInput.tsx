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
import { z, ZodError } from "zod";
import DOMPurify from "isomorphic-dompurify";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLock,
} from "react-icons/ai";
// Define your types using Zod
const emailType = z.coerce.string().email();
const passwordType = z
  .string()
  .min(6, "Password too short")
  .max(24, "Password too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@!#$%^*&]{6,24}$/,
    "Password must contain at least one uppercase, lowercase, number and special character"
  );
const stringType = z.coerce.string().max(50); // Added maximum length constraint
const phoneType = z.coerce
  .string()
  .refine((value) => /^\d{10}$/.test(value.replace(/[-\s]/g, "")), {
    message: "Invalid phone number",
  });

const numberType = z.coerce
  .string()
  .transform((value) => parseFloat(value))
  .refine((value) => !isNaN(value) && value >= 0, {
    message: "Value must be a non-negative number",
  })
  .refine((value) => /^(\d{1,10}|\d{0,9}\.\d{1,9})$/.test(value.toString()), {
    message:
      "Input should be non-negative and contain up to 10 digits, including decimals",
  });

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

function TextInput({
  type,
  name,
  classNames,
  placeholder,
  label,
  values: initialValue,
  icon,
  onChange,
  required = false,
  clearOnSuccess = false,
  disabled = false,
}: TextInputProps) {
  const [value, setValue] = useState<string>(initialValue || "");
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
      const validationResult = getTypeValidator().safeParse(sanitizedValue);
      if (!validationResult.success) {
        const validationError = validationResult.error;

        if (validationError instanceof ZodError) {
          setError(validationError.errors[0]?.message ?? "Invalid input");
        } else {
          setError("Invalid input");
        }
      } else {
        setError(null);
        setValue(inputValue);
        if (onChange) {
          onChange(sanitizedValue);
        }
      }
    }
  };

  const getTypeValidator = () => {
    switch (type) {
      case "email":
        return emailType;
      case "text":
        return stringType;
      case "password":
        return passwordType;
      case "phone":
        return phoneType;
      case "number":
        return numberType;
      default:
        return z.string(); // Default to string type if type is not recognized
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

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
            value={value}
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
            value={value}
            onChange={handleChange}
            className={`bg-gray-50 border ${
              icon ? "pl-10" : ""
            } border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${classNames || ""}`}
          />
        </div>
      )}

      {error && (
        <div className="text-red-500 w-72 md:w-52 text-xs mt-1">{`Error: ${error}`}</div>
      )}
    </div>
  );
}

export default memo(TextInput);
