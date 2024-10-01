/** @format */
"use client";

import LoadingComponent from "@/components/UIComponent/Loading/LoadingComponent";
import { SubscribeToPush } from "@/components/UIComponent/Notification/SuscribeToPush";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
const AdminDash = dynamic(
  () => import("@/components/CoreComponent/admin/dashboard/DashAdmin"),
  {
    loading: () => <LoadingComponent />, // Show the placeholder component while loading
    ssr: false, // Set to false if you don't want server-side rendering for this component
  }
);
export default function DashboardDirect() {
  const router = useRouter();

  const [Component, setComponent] = useState<React.ReactNode | null>(null);
  const { data: session, status } = useSession();

  // const handleCreateSetting = async () => {
  //   const response = await createAdminSetting();
  //   if (response?.success) {
  //     window.location.reload();
  //   }
  // };

  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.role === "Admin") {
      if (session.user.isVerified) {
        setComponent(<AdminDash />);
      } else {
        // Handle case when the user is not verified
        setComponent(<p>Your account is not verified yet.</p>);
      }
    }
  }, [session]);

  const changeFont = (fontSize: string) => {
    switch (fontSize) {
      case "small":
        document.documentElement.style.fontSize = "16px";
        break;
      case "medium":
        document.documentElement.style.fontSize = "20px";
        break;
      case "large":
        document.documentElement.style.fontSize = "24px";
        break;
      default:
        document.documentElement.style.fontSize = "16px"; // Default case if none is matched
    }
  };

  return (
    <>
      {" "}
      <SubscribeToPush />
      {Component}
    </>
  );
}
