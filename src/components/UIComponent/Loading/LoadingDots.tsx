/** @format */

import clsx from "clsx";

const dotStyle = "mx-[1px] inline-block h-1 w-1 rounded-md";

const LoadingDots = ({ className }: { className: string }) => {
  return (
    <span className="inline-flex items-center">
      <span className={clsx(dotStyle, "circle-1", className)} />
      <span className={clsx(dotStyle, "circle-2", className)} />
      <span className={clsx(dotStyle, "circle-3", className)} />
    </span>
  );
};

export default LoadingDots;
