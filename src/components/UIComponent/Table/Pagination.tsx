/** @format */
"use client";
import React from "react";

interface PaginationProps {
  data: any[];
  currentPage: number;
  indexOfLastItem: number;
  handlePaginationClick: (pageNumber: number) => void;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  data,
  currentPage,
  indexOfLastItem,
  handlePaginationClick,
  itemsPerPage,
}) => {
  const maxPageButtons = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const renderPageButtons = () => {
    const pageButtons = [];

    if (totalPages <= maxPageButtons) {
      // Display all page buttons if total pages are less than or equal to maxPageButtons
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePaginationClick(i)}
            className={
              currentPage === i ? " w-5 p-1  bg-blue-600 text-white" : ""
            }>
            {i}
          </button>
        );
      }
    } else {
      // Display a portion of page buttons with '...' in between
      const leftEllipsis = currentPage > maxPageButtons / 2 + 1;
      const rightEllipsis = currentPage < totalPages - maxPageButtons / 2;

      pageButtons.push(
        <button key={1} onClick={() => handlePaginationClick(1)}>
          1
        </button>
      );

      if (leftEllipsis) {
        pageButtons.push(<span key={"leftEllipsis"}>...</span>);
      }

      for (let i = currentPage; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pageButtons.push(
            <button
              key={i}
              onClick={() => handlePaginationClick(i)}
              className={
                currentPage === i ? " w-5 p-1 bg-blue-600 text-white" : ""
              }>
              {i}
            </button>
          );
        }
      }

      if (rightEllipsis) {
        pageButtons.push(<span key={"rightEllipsis"}>...</span>);
      }

      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePaginationClick(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="my-auto flex flex-col justify-center px-4   md:flex-row md:space-x-5">
      <div className="my-auto mb-2 flex w-full justify-center md:mb-0 md:w-fit">
        {" "}
        <nav className="flex items-center gap-x-1">
          <button
            type="button"
            onClick={() => handlePaginationClick(currentPage - 1)}
            className={`inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-xs text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
              currentPage === 1
                ? "disabled:pointer-events-none disabled:opacity-50"
                : ""
            } dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10`}
            disabled={currentPage === 1}>
            <svg
              className="h-3.5 w-3.5 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Previous</span>
          </button>
          <div className="flex items-center gap-x-1">
            {/* {Array.from({
              length: Math.ceil(data.length / itemsPerPage),
            }).map((_, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePaginationClick(index + 1)}
                className={`flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg px-3 py-2 text-xs text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                  currentPage === index + 1 ? "bg-gray-200" : ""
                } dark:bg-gray-600 dark:text-white dark:focus:bg-gray-500`}>
                {index + 1}
              </button>
            ))} */}

            {renderPageButtons()}
          </div>
          <button
            type="button"
            onClick={() => handlePaginationClick(currentPage + 1)}
            className={`inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-xs text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
              indexOfLastItem >= data.length
                ? "disabled:pointer-events-none disabled:opacity-50"
                : ""
            } dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10`}
            disabled={indexOfLastItem >= data.length}>
            <span>Next</span>
            <svg
              className="h-3.5 w-3.5 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
