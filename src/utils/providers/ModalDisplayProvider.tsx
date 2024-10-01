/** @format */

import React, { createContext, useContext, useState, ReactNode } from "react";
import { IoIosArrowBack } from "react-icons/io";

// Define the type for the modal context
interface ModalContextType {
  openModal: (content: ReactNode, title?: string) => string;
  closeModal: (id: string) => void;
}

// Define the type for the modal state
interface ModalState {
  id: string;
  content: ReactNode;
  title?: string;
}

// Create the modal context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Modal provider to wrap the app and provide the modal context
export const ModalDisplayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modals, setModals] = useState<ModalState[]>([]);

  // Function to open a modal with specified content and title
  const openModal = (content: ReactNode, title?: string): string => {
    const id = Math.random().toString(36).substr(2, 9);
    setModals((prevModals) => [...prevModals, { id, content, title }]);
    return id;
  };

  // Function to close a modal by its ID
  const closeModal = (id: string) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.id !== id));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((modal) => (
        <div
          key={modal.id}
          className="fixed inset-0 w-full min-h-screen bg-black bg-opacity-50 z-50">
          <div className="relative p-4 rounded bg-gray-100 shadow-lg w-full h-screen">
            <div className="flex items-center bg-green-600  text-white rounded">
              <button
                className="p-2 my-auto flex "
                onClick={() => closeModal(modal.id)}>
                <span className="my-auto">
                  <IoIosArrowBack className="mr-2 my-auto" />
                </span>

                <span className="my-auto text-xs">Back</span>
              </button>
              {modal.title && (
                <span className=" border-s-2 pl-4 text-sm font-medium">
                  {modal.title}
                </span>
              )}
            </div>
            <div className="mt-2 h-[90vh] p-4 bg-white overflow-y-auto border">
              {modal.content}
            </div>
          </div>
        </div>
      ))}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalDisplayProvider");
  }
  return context;
};
