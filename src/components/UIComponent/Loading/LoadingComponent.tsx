/** @format */

import LoadingSpinner from "./LoadingSpinner";
import LoadingDots from "./LoadingDots";

const LoadingComponent = () => {
  return (
    <div className="flex h-screen items-center justify-center space-x-2 my-auto">
      <div className=" my-auto mr-2">
        {/* <Spinner /> */}
        <LoadingSpinner />
      </div>

      <p className="text-center">Loading</p>
      <div className=" my-auto">
        {" "}
        <LoadingDots className={"bg-black dark:bg-white"} />
      </div>
    </div>
  );
};

export default LoadingComponent;
