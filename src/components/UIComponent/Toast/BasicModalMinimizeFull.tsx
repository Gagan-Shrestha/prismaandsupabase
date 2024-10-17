/** @format */

import React, { ReactNode, useState } from "react";
import Draggable from "react-draggable";
import {
  FaMinus,
  FaTimes,
  FaTimesCircle,
  FaWindowMaximize,
} from "react-icons/fa";

interface BasicModalMinimizeFullProps {
  id?: string;
  title?: String;
  onClose: () => void;
  component: ReactNode; // replace with the actual type of your data
}

const BasicModalMinimizeFull: React.FC<BasicModalMinimizeFullProps> = ({
  id,
  title,
  onClose,
  component,
}) => {
  const [isMninimzed, setIsMinimized] = useState(false);
  const [isMaxmimized, setIsMaximized] = useState(true);
  const closeModal = () => {
    onClose();
  };

  const minimizeModal = () => {};
  const maximizeModal = () => {};
  return (
    <>
      <div className=" hidden md:block">
        <Draggable cancel=".non-draggable">
          <div
            id="extralarge-BasicModalMinimizeFull"
            tabIndex={-1}
            className="fixed top-0 left-0 right-0 z-50 items-center  w-full p-2 overflow-x-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div
              className={`relative w-full ${
                isMninimzed ? " max-w-52" : "w-full"
              }  `}
            >
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between px-3 py-2 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-sm font-medium truncate ... text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  {/* <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={onClose}>
                          <FaTimesCircle />
                          <span className="sr-only">Close Modal</span>
                        </button> */}
                  <div className="flex space-x-2">
                    {/* Minimize Button */}
                    <button
                      onClick={() => {
                        setIsMinimized(true);
                        setIsMaximized(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaMinus fontSize={12} />
                    </button>
                    {/* Maximize Button */}
                    <button
                      onClick={() => {
                        setIsMaximized(true);
                        setIsMinimized(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaWindowMaximize fontSize={12} />
                    </button>
                    {/* Close Button */}
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes fontSize={12} />
                    </button>
                  </div>
                </div>
                <div
                  className={`p-2 w-full h-[89vh]  overflow-y-auto flex justify-center non-draggable ${
                    isMninimzed ? "hidden" : "block"
                  } `}
                >
                  {/* BasicModalMinimizeFull content goes here */}
                  {component}
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      </div>
      <div className=" block md:hidden">
        <div>
          <div className="fixed top-0 left-0 right-0 z-50 items-center  w-full p-2 overflow-x-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div
              className={`relative w-full ${
                isMninimzed ? " top-16 left-16 max-w-52" : "max-w-7xl"
              }  `}
            >
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between px-3 py-2 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-sm font-medium truncate ... text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  {/* <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={onClose}>
                          <FaTimesCircle />
                          <span className="sr-only">Close Modal</span>
                        </button> */}
                  <div className="flex space-x-2">
                    {/* Minimize Button */}
                    <button
                      onClick={() => {
                        setIsMinimized(true);
                        setIsMaximized(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaMinus fontSize={12} />
                    </button>
                    {/* Maximize Button */}
                    <button
                      onClick={() => {
                        setIsMaximized(true);
                        setIsMinimized(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaWindowMaximize fontSize={12} />
                    </button>
                    {/* Close Button */}
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes fontSize={12} />
                    </button>
                  </div>
                </div>
                <div
                  className={` w-full h-[89vh]  overflow-y-auto flex justify-center ${
                    isMninimzed ? "hidden" : "block"
                  } `}
                >
                  {/* BasicModalMinimizeFull content goes here */}
                  {component}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicModalMinimizeFull;
