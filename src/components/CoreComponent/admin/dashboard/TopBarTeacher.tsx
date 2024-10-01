/** @format */
"use client";
import {
  FaSearch,
  FaBell,
  FaExclamationCircle,
  FaUser,
  FaBars,
  FaTimes,
  FaRegWindowClose,
} from "react-icons/fa";
import { ReactNode, useEffect, useRef, useState } from "react";

import { IoChatboxEllipses } from "react-icons/io5";

import { searchUsers } from "./SearchAction";
import Image from "next/image";
import Link from "next/link";
import ProfileAvatar from "./ProfileAvatarAdmin";

interface TopBarProps {
  toggleSidebar: (val: boolean) => void;
}

const TopBarTeacher: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAlertMenuOpen, setIsAlertMenuOpen] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const outsideClick = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchDisplayComponent, setSearchDisplayComponent] =
    useState<ReactNode>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const closeRightDrawer = () => {
    setIsRightDrawerOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: Event): void {
      if (
        outsideClick.current &&
        !outsideClick.current.contains(event.target as Node)
      ) {
        setIsNotificationMenuOpen(false);
        setIsRightDrawerOpen(false);
        setIsProfileMenuOpen(false);
        setIsAlertMenuOpen(false);
      }
    }

    if (isNotificationMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    if (isAlertMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    if (isProfileMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [
    isAlertMenuOpen,
    isNotificationMenuOpen,
    isProfileMenuOpen,
    isRightDrawerOpen,
  ]);

  useEffect(() => {
    const fetchStoreSuggestion = async () => {
      try {
        const response = await searchUsers(searchTerm.toLowerCase());
        if (response?.success) {
          const data = response?.success;
          //console.log("receiver:", data);
          // if (data.length > 0) {
          //   setSuggestions(data);
          // } else {
          //   setSuggestions([]);
          // }
        } else if (response?.error) {
          //console.log(response?.error);
          setSuggestions([]);
        } else {
          console.error("Failed to fetch suggestions");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    if (searchTerm !== "" && searchTerm.length > 2) {
      fetchStoreSuggestion();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);
  const handleSuggestionClick = (result: any) => {
    if (result.source === "farmerInfo") {
      console.log(result);
      setSelectedUser(result.userInId);
      // setSearchDisplayComponent(
      //   <FarmerProfile selectedFarmer={result.userInId} />
      // );
      setIsModalOpen(true);
    } else if (result.source === "groupInfo") {
      console.log(result);
      setSelectedUser(result.groupInfoId);
      // setSearchDisplayComponent(
      //   <CooperativeProfile selectedCooperative={result.groupInfoId} />
      // );
      setIsModalOpen(true);
    }
    if (result.source === "officerInfo") {
      console.log(result);
      setSelectedUser(result.userInId);
      // setSearchDisplayComponent(<OfficerProfile selectedOfficer={result} />);
      setIsModalOpen(true);
    }
    if (result.source === "distributor") {
      console.log(result);
      setSelectedUser(result.userId);
      // setSearchDisplayComponent(
      //   <DistributorProfile selectedDistributor={result} />
      // );
      setIsModalOpen(true);
    }
    if (result.source === "wholeSeller") {
      console.log(result);
      setSelectedUser(result.userId);
      // setSearchDisplayComponent(
      //   <WholesalerProfile selectedWholesaler={result} />
      // );
      setIsModalOpen(true);
    }
  };
  return (
    <div ref={outsideClick}>
      <div className="flex items-center justify-between px-4 md:py-2 py-4 bg-blue-600 text-white ">
        <div className="flex items-center">
          <div className="flex items-center space-x-4 ">
            <button
              onClick={() => toggleSidebar(true)}
              className="lg:hidden text-xl"
            >
              <FaBars />
            </button>
            <div className="relative hidden md: w-96 lg:block">
              <input
                type="text"
                onClick={() => setIsSearchModalOpen(true)}
                className="bg-white text-xs w-full text-black  p-2 rounded-lg pl-10 focus:outline-none"
                placeholder="Search, Property, Lease, Tenants .........."
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              className="lg:hidden text-xl"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="mr-2 hidden md:block" style={{ width: "20rem" }}>
            {" "}
            {/* Adjust the width here */}
          </div>
          <IoChatboxEllipses
            onClick={() => {
              setIsRightDrawerOpen(true);
            }}
            className="text-xl cursor-pointer"
          />

          {isProfileMenuOpen && <ProfileAvatar />}
        </div>
      </div>

      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full h-[90vh] m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">search</h2>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-200 text-black p-2 rounded-lg pl-10 w-full focus:outline-none"
                placeholder="search"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            </div>
          </div>
        </div>
      )}

      {selectedUser && isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="bg-white p-4 rounded-lg shadow-md">
            {searchDisplayComponent}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TopBarTeacher;

const Modal: React.FC<{ onClose: () => void; children: ReactNode }> = ({
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-2 rounded-lg shadow-md w-[90vw] h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2  rounded"
        >
          <FaRegWindowClose size={24} />
        </button>
        <div className=" overflow-y-auto h-[85vh]"> {children}</div>
      </div>
    </div>
  );
};
