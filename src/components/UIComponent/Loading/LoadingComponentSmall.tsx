/** @format */

import LoadingDots from "./LoadingDots";
import LoadingSpinnerSmall from "./LoadingSpinnerSmall";

const LoadingComponentSmall = () => {
  return (
    <div className="flex justify-center space-x-2 my-auto">
      <div className=" my-auto mr-2">
        {/* <Spinner /> */}
        <LoadingSpinnerSmall />
      </div>

      <p className="text-center">Loading</p>
      <div className=" my-auto">
        {" "}
        <LoadingDots className={"bg-black dark:bg-white"} />
      </div>
    </div>
  );
};

export default LoadingComponentSmall;
