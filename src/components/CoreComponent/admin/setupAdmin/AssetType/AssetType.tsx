/** @format */
"use client";
import React, { useState, ReactNode, useEffect } from "react";

import { IoMdAddCircle } from "react-icons/io";
import { FaRegWindowClose } from "react-icons/fa";

import useAssetMutations from "./AssetMutations";
import { useQuery } from "@tanstack/react-query";
import { getAllAssets } from "./AssetServerActions";
import LoadingComponentSmall from "@/components/UIComponent/Loading/LoadingComponentSmall";
import ConfirmButton from "@/components/UIComponent/ConfirmButton";
import Pagination from "@/components/UIComponent/Table/Pagination";
import SuccessNotification from "@/components/UIComponent/Notification/SuccessNotification";
import FailedNotification from "@/components/UIComponent/Notification/FailedNotification";

const AssetType: React.FC = () => {
  const { addAsset, deleteAsset } = useAssetMutations();
  const [assetData, setAssetData] = useState<any | null>([]);
  const [assetType, setAssetType] = useState("");
  const [selectedAssetType, setSelectedAssetType] = useState<any | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEditAsset = (asset: any) => {
    setSelectedAssetType(asset);
    setAssetType(asset.assetType);
    setShowFormModal(true);
  };

  const { data: assets } = useQuery({
    queryKey: ["AssetDetails"],
    queryFn: async () => getAllAssets(),
  });

  useEffect(() => {
    if (assets?.assets) {
      setAssetData(assets?.assets);
    }
  }, [assets]);

  const filteredData = assetData
    ? assetData.filter((action: any) =>
        action.assetType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAddAsset = async () => {
    setIsLoading(true);
    if (assetType !== "") {
      try {
        const dataSend = {
          id: selectedAssetType?.assetTypeId || "",
          assetType: assetType,
        };
        const response = await addAsset(JSON.stringify(dataSend));
        if (response?.success) {
          if (selectedAssetType) {
            setSuccessMessage("Asset type updated successfully!");
          } else {
            setSuccessMessage("Asset type added successfully!");
          }
          setSelectedAssetType(null);
          setAssetType("");
          setShowFormModal(false);
        } else if (response?.error) {
          setErrorMessage("Failed to add asset type. Please try again.");
        } else {
          setErrorMessage("Please try again later.");
        }
      } catch (error) {
        setErrorMessage("Failed to add asset type. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Enter a valid asset name");
      setIsLoading(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      const response = await deleteAsset(id);
      if (response?.success) {
        setSuccessMessage("Asset type deleted successfully!");
      } else {
        setErrorMessage("Failed to delete asset type. Please try again.");
      }
    } catch (error) {
      ("Failed to delete asset type. Please try again.");
    }
  };

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

  const breadcrumbItems = [
    { title: "Home", link: "/dashboard?component=dashboardAdmin" },
    { title: "Asset Types" },
  ];

  return (
    <div className="w-full mx-auto px-2">
      <div className="flex md:flex-row flex-col justify-between mb-2">
        <div className="m-2 flex justify-end">
          <button
            onClick={() => {
              setAssetType("");
              setSelectedAssetType(null);
              setShowFormModal(true);
            }}
            className="p-2 bg-green-700 hover:bg-green-800 text-sm text-white rounded flex space-x-2"
          >
            <IoMdAddCircle size={16} className="my-auto" />
            <span>Add Asset Type</span>
          </button>
        </div>
      </div>

      {showFormModal && (
        <Modal onClose={() => setShowFormModal(false)}>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-center">
              <h2 className="md:text-xl text-sm font-bold mb-2">
                {selectedAssetType ? "Edit Asset Type" : "Add Asset Type"}
              </h2>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Asset Type Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleAddAsset}
              className="w-full p-2 bg-green-500 text-white rounded"
            >
              {isLoading ? (
                <LoadingComponentSmall />
              ) : selectedAssetType ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </Modal>
      )}

      <input
        type="text"
        placeholder="Search Asset Type"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-gray-300 text-gray-900 mb-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      <div className="align-middle overflow-y-auto md:text-sm text-sm">
        <div className="hidden md:block">
          <div className="divide-y relative h-[60vh] md:h-[65vh] overflow-y-auto divide-gray-200 rounded-lg border overflow-auto dark:divide-gray-700 dark:border-gray-700">
            <table className="divide-y min-w-full divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="py-2 px-4 border-b">Asset Types</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500 dark:divide-gray-700">
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((asset: any, index: number) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-center">
                        {asset.assetType}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="px-2 py-1 bg-yellow-500 m-2 text-white rounded ml-2"
                        >
                          Edit
                        </button>
                        <ConfirmButton
                          buttonName="Delete"
                          buttonMessage="Do you want to delete this asset?"
                          buttonType="Confirm"
                          userId={asset.assetTypeId}
                          handleConfirm={(value) => handleDeleteAsset(value)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-gray-500">
                      "No asset type found"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {successMessage && <SuccessNotification message={successMessage} />}
      {errorMessage && <FailedNotification message={errorMessage} />}
    </div>
  );
};

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
        <div className="overflow-y-auto h-[85vh]">{children}</div>
      </div>
    </div>
  );
};

export default AssetType;
