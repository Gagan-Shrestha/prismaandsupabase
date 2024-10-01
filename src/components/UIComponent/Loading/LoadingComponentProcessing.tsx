/** @format */

import LoadingSpinner from "./LoadingSpinner";
import LoadingDots from "./LoadingDots";

const LoadingComponentProcessing = () => {
  return (
    <div className=" flex h-screen items-center justify-center space-x-2 my-auto">
      <div className=" my-auto mr-2">
        {/* <Spinner /> */}
        <LoadingSpinner />
      </div>
      {/* 
      <p className="text-center">Loading</p>
      <LoadingDots className={"bg-black dark:bg-white"} /> */}
    </div>
  );
};

export default LoadingComponentProcessing;
