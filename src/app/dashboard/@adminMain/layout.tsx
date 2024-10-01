/** @format */
"use client";

import { DisplayProviderAdminMain } from "@/utils/providers/displayProvider/DisplayProviderAdminMain";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DisplayProviderAdminMain>{children}</DisplayProviderAdminMain>
    </>
  );
}
