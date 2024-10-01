/** @format */

import LoadingComponent from "@/src/Components/UIComponents/LoadingComponent";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const ResetPassword = dynamic(
  () => import("@/src/Components/CoreComponent/Password/ResetPassword"),
  {
    loading: () => <LoadingComponent />, // Show the placeholder component while loading
    ssr: false, // Set to false if you don't want server-side rendering for this component
  }
);
export default function page() {
  return (
    <div>
      <Suspense fallback={<LoadingComponent />}>
        <ResetPassword />
      </Suspense>
    </div>
  );
}
