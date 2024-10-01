/** @format */

"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import useAssetManagerMutation from "./TeacherMutation";

import SuccessNotification from "@/components/UIComponent/Notification/SuccessNotification";
import FailedNotification from "@/components/UIComponent/Notification/FailedNotification";
import useTeacherMutation from "./TeacherMutation";
import { getTeacher } from "./TeacherServer";
import ConfirmButton from "@/components/UIComponent/ConfirmButton";
import Pagination from "@/components/UIComponent/Table/Pagination";
import AddTeacher from "./AddTeacher";
import { setUncaughtExceptionCaptureCallback } from "process";

const TeacherTable = () => {
  const [teacherData, setTeacherData] = useState<any>([]);
  const { deleteTeacherData } = useTeacherMutation();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: getTeacherInfo,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["teacher"],
    queryFn: async () => getTeacher(),
  });
  // Update teacher data when fetch is successful
  useEffect(() => {
    if (getTeacherInfo?.success && Array.isArray(getTeacherInfo?.success)) {
      setTeacherData(getTeacherInfo.success); // Set data directly from API response
    } else {
      setTeacherData([]); // Set an empty array if no data is found
    }
  }, [getTeacherInfo]);

  // Handle data fetch errors
  useEffect(() => {
    if (isError) {
      setErrorMessage("Failed to fetch teacher data.");
      setTeacherData([]); // Set an empty array in case of error
    }
  }, [isError]);

  // Filter employees based on search query
  const filteredData = Array.isArray(teacherData)
    ? teacherData.filter((teacher: any) =>
        teacher?.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePaginationClick = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [successMessage, errorMessage]);

  const [selectManager, setSelectManager] = useState<any>(null); // Track selected teacher for editing
  const [managerId, setManagerId] = useState(""); // Holds the teacher data array
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleAddAssetManager = () => {
    setSelectManager(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectManager(null);
  };
  // Handle modal visibility for editing an existing teacher
  const hanldeEditTeacher = (teacher: any) => {
    setSelectManager(teacher);
    setManagerId(teacher.managerId);
    setIsModalOpen(true);
  };
  const handleDelete = async (managerId: string) => {
    console.log("check delete", managerId);
    const response = await deleteTeacherData(managerId);
    if (response?.success) {
      setSuccessMessage(response?.success);
    } else if (response?.error) {
      setErrorMessage(response?.error);
    } else {
      console.error("Failed to delete course:", response?.error);
    }
  };
  return (
    <div>
      {/* Button to open the modal */}
      <div className="m-2 flex justify-end">
        <button
          onClick={handleAddAssetManager}
          className="bg-blue-700 flex space-x-2 text-xs mb-2 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          <IoMdAddCircle size={16} className="my-auto" />
          <span>Add Asset Teacher</span>
        </button>
      </div>

      <div className="hidden md:block">
        <div className="flex max-h-96 flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              <div className="divide-y divide-gray-200 rounded-lg border dark:divide-gray-700 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                        Teacher Name
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                        Teacher Email
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                        Teacher Phone
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                        Teacher Photo
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No Teachers found.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((teacher: any) => (
                        <tr key={teacher.teacherInfoId}>
                          <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                            {teacher.teacherName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                            {teacher.teacherEmail}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                            {teacher.teacherPhone}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium">
                            <Image
                              src={teacher?.teacherPhoto || "/placeholder.png"}
                              alt="teacher Photo"
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
                                onClick={() => hanldeEditTeacher(teacher)}
                              >
                                Edit
                              </button>
                              <ConfirmButton
                                classNames="text-xs px-2 py-1 border rounded-md bg-red-500 text-white"
                                buttonName="Delete"
                                buttonMessage={
                                  "Are you sure you want to delete?"
                                }
                                buttonType="delete"
                                userId={teacher?.teacherInfoId}
                                handleConfirm={(value) => handleDelete(value)}
                              />
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
      <div className="mt-2">
        <Pagination
          currentPage={currentPage}
          data={filteredData}
          handlePaginationClick={handlePaginationClick}
          itemsPerPage={itemsPerPage}
          indexOfLastItem={indexOfLastItem}
        />
      </div>
      {/* Modal for adding/editing teacher info */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="bg-white p-4">
            <AddTeacher
              teacher={selectManager}
              teacherId={managerId}
              isEditMode={!!selectManager}
              onSuccess={handleCloseModal}
            />
          </div>
        </Modal>
      )}

      {successMessage && <SuccessNotification message={successMessage} />}
      {errorMessage && <FailedNotification message={errorMessage} />}
    </div>
  );
};

export default TeacherTable;

// Modal Component
const Modal: React.FC<{ onClose: () => void; children: ReactNode }> = ({
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-2 rounded-lg shadow-md w-[95vw] h-[95vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:text-red-500 transition duration-300"
        >
          <RxCross2 size={24} />
        </button>
        <div className="overflow-y-auto h-[85vh] p-4">{children}</div>
      </div>
    </div>
  );
};
