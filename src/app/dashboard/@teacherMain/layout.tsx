/** @format */
"use client";

import { DisplayProviderTeacher } from "@/utils/providers/displayProvider/DisplayProviderTeacherMain";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DisplayProviderTeacher>{children}</DisplayProviderTeacher>
    </>
  );
}
