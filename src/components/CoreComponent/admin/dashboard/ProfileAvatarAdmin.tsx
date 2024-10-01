/** @format */
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function ProfileAvatar() {
  const session = useSession();

  return (
    <div
      className="absolute top-10 right-3 z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
      id="dropdown"
    >
      <div className="py-3 px-4">
        <span className="block text-sm font-semibold text-gray-900 dark:text-white">
          {session.data?.user.role}
        </span>
        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
          {session.data?.user.email}
        </span>
      </div>
      <ul
        className="py-1 text-gray-500 dark:text-gray-400"
        aria-labelledby="dropdown"
      ></ul>

      <ul
        className="py-1 text-gray-500 dark:text-gray-400"
        aria-labelledby="dropdown"
      >
        <li>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            singout
          </button>
        </li>
      </ul>
    </div>
  );
}
