/** @format */
import { FaHandshakeSimple } from "react-icons/fa6";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import BasicModalMinimizeFull from "@/components/UIComponent/Toast/BasicModalMinimizeFull";
import AddManager from "./AddManager";
import AddManagerBulk from "./AddManagerBulk";

interface assetOptionInterface {
  buttonText: String;
  modalTitle?: String;
  modalDescription?: String;
  qrComponent?: React.ReactNode;
  customComponent?: React.ReactNode;
}
const AddManagerOption: React.FC<assetOptionInterface> = ({
  buttonText,
  modalTitle,
  modalDescription,

  qrComponent,
  customComponent,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: Event): void {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const [modalComponents, setModalComponents] = useState<
    { id: string; title: string; component: React.ReactNode }[]
  >([]);

  const handleOptionClick = (value: string) => {
    let newModalComponents = [...modalComponents];
    switch (value) {
      case "addIndividual":
        const newId = `modal_${Date.now()}`; // Generate unique id
        newModalComponents.push({
          id: newId,
          title: "Add Individual Manager",
          component: <AddManager />,
        });

        break;

      case "addBulkParty":
        const newIdBulk = `modal_${Date.now()}`; // Generate unique id
        newModalComponents.push({
          id: newIdBulk,
          title: "Add Bulk Manager",
          component: <AddManagerBulk />,
        });

        break;
    }
    // setModalComponent(customComponent);
    setModalComponents(newModalComponents);

    setIsOpen(false);
  };

  return (
    <div className="relative " ref={drawerRef}>
      <button
        type="button"
        className="flex items-center justify-center w-full px-4 py-2 text-xs font-medium text-white rounded-lg md:w-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={toggleDrawer}
      >
        {buttonText}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-400 bg-opacity-30"
          onClick={toggleDrawer}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-40 h-full w-full max-w-md transform border-e bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
          isOpen ? "-translate-x-0" : "translate-x-full"
        }`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
          <h3 className="font-bold text-sm text-center text-gray-800 dark:text-white">
            {modalTitle}
          </h3>

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            onClick={toggleDrawer}
          >
            <span className="sr-only">Close modal</span>
            <svg
              className="h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <div className=" border rounde p-4 m-1 my-auto">
            {" "}
            <div className="p-4 text-center overflow-y-auto">
              <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-blue-50 bg-blue-100 text-blue-500 dark:bg-blue-700 dark:border-blue-600 dark:text-blue-100">
                <FaHandshakeSimple size={36} />
              </span>

              <h3 className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                {buttonText}
              </h3>
              <p className="text-gray-500 text-sm font-normal">
                {modalDescription}
              </p>

              <div className="mt-6 flex flex-col space-y-3 justify-center gap-x-4">
                <button
                  onClick={() => handleOptionClick("addIndividual")}
                  className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  {" "}
                  Add Individual Manager
                </button>

                <button
                  type="button"
                  onClick={() => handleOptionClick("addBulkParty")}
                  className="py-2 px-3 flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  data-hs-overlay="#hs-sign-out-alert"
                >
                  Upload Bulk Manager Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalComponents.map((modal: any, key: number) => (
        <BasicModalMinimizeFull
          key={key}
          title={modal.title}
          onClose={() => {
            const newModalComponents = modalComponents.filter(
              (item: any) => item.id !== modal.id
            );
            setModalComponents(newModalComponents);
          }}
          component={<div className=" w-full">{modal.component}</div>}
          id={modal.id}
        />
      ))}
    </div>
  );
};

export default AddManagerOption;
