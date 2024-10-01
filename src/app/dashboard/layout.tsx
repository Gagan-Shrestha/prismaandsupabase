/** @format */
"use client";

import { DisplayProviderAdminMain } from "@/utils/providers/displayProvider/DisplayProviderAdminMain";
import { DisplayProviderTeacher } from "@/utils/providers/displayProvider/DisplayProviderTeacherMain";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Layout({
  children,
  adminMain,
  teacherMain,
}: {
  children: React.ReactNode;
  adminMain: React.ReactNode;
  teacherMain: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>; // Or any other loading indicator
  }

  const userRole = session?.user?.role;
  console.log(userRole);
  return (
    <>
      {children}
      {userRole === "Admin" && (
        <DisplayProviderAdminMain>{adminMain}</DisplayProviderAdminMain>
      )}
      {userRole === "Teacher" && (
        <DisplayProviderTeacher>{teacherMain}</DisplayProviderTeacher>
      )}

      {/* {userRole === "AssetManager" && (
        <DisplayProviderManager>{assetManager}</DisplayProviderManager>
      )} */}
    </>
  );
}
