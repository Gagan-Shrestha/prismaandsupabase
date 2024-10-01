/** @format */
"use client";

import TeacherDash from "@/components/CoreComponent/admin/dashboard/DashTeacher";
import LoadingComponent from "@/components/UIComponent/Loading/LoadingComponent";
import { SubscribeToPush } from "@/components/UIComponent/Notification/SuscribeToPush";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { ReactNode, Suspense, useEffect, useState } from "react";

const DashTeacher = dynamic(
  () => import("@/components/CoreComponent/admin/dashboard/DashTeacher"),
  {
    loading: () => <LoadingComponent />, // Show the placeholder component while loading
    ssr: false, // Set to false if you don't want server-side rendering for this component
  }
);

export default function DashboardDirect() {
  const router = useRouter();

  const [Component, setComponent] = useState<React.ReactNode | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);
  useEffect(() => {
    if (session) {
      setLoadingSettings(false);
      if (session.user.isVerified) {
        setComponent(<DashTeacher />);
      }
    }
  }, [session]);
  if (status === "loading") {
    return <LoadingComponent />; // Or any other loading indicator
  }
  if (loadingSettings) {
    return <LoadingComponent />; // Or any other loading indicator
  }
  //for darkmode

  return (
    <>
      {" "}
      <SubscribeToPush />
      {Component}
    </>
  );
}
