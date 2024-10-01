/** @format */

// import VerificationPage from "@/components/CoreComponents/Authentication/verification/VerificationPage";

import LoadingComponent from "@/src/Components/UIComponents/LoadingComponent";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const VerificationPage = dynamic(() => import("./Verification"), {
  loading: () => <LoadingComponent />, // Show the placeholder component while loading
  ssr: false, // Set to false if you don't want server-side rendering for this component
});
export default function page() {
  return (
    <div>
      {/* Wrap VerificationPage in Suspense and provide a fallback UI */}
      <Suspense
        fallback={
          <div>
            <LoadingComponent />
          </div>
        }>
        <VerificationPage />
      </Suspense>
    </div>
  );
}
