/** @format */

"use client";

import React, { ReactNode, useEffect, useState } from "react"; // Import necessary hooks and types from React
import { IoMdAddCircle } from "react-icons/io"; // Import an icon for adding an employee
import { RxCross2 } from "react-icons/rx"; // Import an icon for closing the modal
import { useQuery } from "@tanstack/react-query"; // Import useQuery for data fetching with React Query
import Image from "next/image"; // Import Image component for optimized images in Next.js

import { getEmployee } from "./AddEmployeeServer"; // Import function to fetch employee data from server

import Pagination from "../UIComponent/Table/Pagination";

const EmployeeTable = () => {
  const { deleteEmployeeData } = useEmployeeMutation();
  // Component state management
  const [employeeData, setEmployeeData] = useState<any[]>([]);

  const [successMessage, setSuccessMessage] = useState(""); // Success message for notifications
  const [errorMessage, setErrorMessage] = useState(""); // Error message for notifications
  const [searchQuery, setSearchQuery] = useState(""); // Search query to filter employee data
  const [currentPage, setCurrentPage] = useState(1); // Current active page number in pagination
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Number of items displayed per page

  // Fetch employee data using react-query
  const {
    data: getEmployeeInfo,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["employee"], // Unique key to identify the query
    queryFn: async () => getEmployee(), // Function to fetch employee data from the server
  });

  // Update employee data when fetch is successful
  useEffect(() => {
    if (getEmployeeInfo?.success && Array.isArray(getEmployeeInfo?.success)) {
      setEmployeeData(getEmployeeInfo.success); // Set data directly from API response
    } else {
      setEmployeeData([]); // Set an empty array if no data is found
    }
  }, [getEmployeeInfo]);

  // Handle data fetch errors
  useEffect(() => {
    if (isError) {
      setErrorMessage("Failed to fetch employee data.");
      setEmployeeData([]); // Set an empty array in case of error
    }
  }, [isError]);

  // Filter employees based on search query
  const filteredData = Array.isArray(employeeData)
    ? employeeData.filter((employee: any) =>
        employee?.employeeName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  // Pagination logic to get current items to display on the page
  const indexOfLastItem = currentPage * itemsPerPage; // Index of last item on the current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Index of first item on the current page
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem); // Items to display on the current page

  // Handle pagination click events
  const handlePaginationClick = (page: number) => {
    setCurrentPage(page); // Set the current page to the clicked page number
  };

  // Clear success or error messages after a delay
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage(""); // Clear success message
        setErrorMessage(""); // Clear error message
      }, 2000); // Timeout duration to display messages

      return () => {
        clearTimeout(timeout); // Cleanup the timeout to prevent memory leaks
      };
    }
  }, [successMessage, errorMessage]); // Re-run when messages change
  const [selectEmployee, setSelectedEmployee] = useState<any>(null); // Track selected employee for editing
  const [employeeId, setEmployeeId] = useState(""); // Holds the employee data array
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Controls modal visibility
  // Handle modal visibility for adding a new employee
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  // Handle modal visibility for editing an existing employee
  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEmployeeId(employee.employeeId);
    setIsModalOpen(true);
  };
  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedEmployee(null); // Reset selected employee state
  };
  const handleDelete = async (employeeId: string) => {
    if (employeeId) {
      const response = window.confirm(
        "Are you sure you want to delete this tenant?"
      );
      if (response) {
        const deleteData = await deleteEmployeeData(employeeId);
        if (deleteData?.success) {
          setSuccessMessage(deleteData?.success);
        } else if (deleteData?.error) {
          setErrorMessage(deleteData?.error);
        }
      }
    }
  };
  return (
    <div>
      {/* Button to open the add employee modal */}
      <div className="m-2 flex justify-end">
        <button
          onClick={handleAddEmployee}
          className="bg-blue-700 flex space-x-2 text-xs mb-2 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          <IoMdAddCircle size={16} className="my-auto" /> {/* Add icon */}
          <span>Add Employee</span> {/* Button text */}
        </button>
      </div>

      {/* Search Bar for filtering employee data */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Employee Name" // Placeholder text for input
          value={searchQuery} // Binds the input value to the search query state
          onChange={(e) => setSearchQuery(e.target.value)} // Updates the search query state on change
          className="p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Styles for input
        />
      </div>

      {/* Check for loading state */}
      {isLoading ? (
        <div className="text-center">Loading employees...</div>
      ) : (
        <>
          {/* Employee Table */}
          <div className="hidden md:block">
            <div className="flex max-h-96 flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="inline-block min-w-full p-1.5 align-middle">
                  <div className="divide-y divide-gray-200 rounded-lg border dark:divide-gray-700 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                            Employee Name
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                            Gender
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                            Citizenship Number
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                            Documents
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                            Photo
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Display message if no employees are found */}
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No employees found.
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((employee: any) => (
                            <tr key={employee.employeeId}>
                              <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                                {employee.employeeName || "N/A"}{" "}
                                {/* Display employee name */}
                              </td>
                              <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                                {employee.gender || "N/A"}{" "}
                                {/* Display employee gender */}
                              </td>
                              <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                                {employee.mobile || "N/A"}{" "}
                                {/* Display employee phone */}
                              </td>
                              <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                                {employee.citizenshipNumber || "N/A"}{" "}
                                {/* Display employee citizenship number */}
                              </td>
                              <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                                {employee.documents &&
                                employee.documents.length > 0 ? (
                                  <div className="flex flex-col items-center space-y-1">
                                    {employee.documents.map(
                                      (doc: string, docIndex: number) => (
                                        <a
                                          key={docIndex}
                                          href={doc}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 hover:underline break-all"
                                        >
                                          {`Document ${docIndex + 1}`}{" "}
                                          {/* Display document link */}
                                        </a>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <span>No Documents</span> // Display if no documents available
                                )}
                              </td>
                              <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                                <Image
                                  src={employee?.photo || "/placeholder.png"} // Display employee photo or placeholder
                                  alt="Employee Photo"
                                  className="w-16 h-16 rounded-lg"
                                  width={100}
                                  height={100}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                                <div className="flex justify-center space-x-2">
                                  {" "}
                                  <button
                                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    onClick={() => handleEditEmployee(employee)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-2 text-xs py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    onClick={() =>
                                      handleDelete(employee.employeeId)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Component */}
          <div className="mt-2">
            <Pagination
              currentPage={currentPage} // Current page number
              data={filteredData} // Data to paginate
              handlePaginationClick={handlePaginationClick} // Function to handle pagination click
              itemsPerPage={itemsPerPage} // Number of items per page
              indexOfLastItem={indexOfLastItem} // Last item index of the current page
            />
          </div>
        </>
      )}

      {/* Modal for adding or editing employee info */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="bg-white p-4">
            <AddEmployee
              employee={selectEmployee}
              employeeId={employeeId}
              isEditMode={!!selectEmployee} // Set edit mode based on tenant presence
              onSuccess={handleCloseModal} // Close modal on successful operation
            />
            {/* Add Employee form component */}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeTable;

// Modal Component
const Modal: React.FC<{ onClose: () => void; children: ReactNode }> = ({
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-2 rounded-lg shadow-md w-[95vw] h-[95vh] relative">
        {/* Button to close the modal */}
        <button
          onClick={onClose}
          className="absolute right-0 top-0 mt-1 mr-1 rounded-full p-2 text-red-500 hover:bg-gray-200 transition-all"
        >
          <RxCross2 size={16} /> {/* Close icon */}
        </button>
        {children} {/* Render child components inside the modal */}
      </div>
    </div>
  );
};
