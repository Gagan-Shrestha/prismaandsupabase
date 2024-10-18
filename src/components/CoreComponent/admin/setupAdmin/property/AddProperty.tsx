"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import LoadingComponent from "@/components/UIComponent/Loading/LoadingComponent";
import TextInput from "@/components/UIComponent/InputField/TextInput";
import SuccessNotification from "@/components/UIComponent/Notification/SuccessNotification";
import FailedNotification from "@/components/UIComponent/Notification/FailedNotification";
import usePropertyMutation from "./PropertyMutation";
import { useQuery } from "@tanstack/react-query";
import { getAllAssets } from "../AssetType/AssetServerActions";

interface AddPropertyProps {
  property?: any;
  isEditMode?: boolean;
  onSuccess: () => void;
  propertyId?: string;
}

const AddProperty: React.FC<AddPropertyProps> = ({
  property,
  isEditMode,
  propertyId,
  onSuccess,
}) => {
  const [propertyData, setPropertyData] = useState({
    propertyName: "",
    propertyAssetType: "",
  });
  const [selectedAssetType, setSelectedAssetType] = useState<any[]>([]);
  const { addPropertyData } = usePropertyMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();

  // Effect to populate form in edit mode
  useEffect(() => {
    if (isEditMode && property) {
      setPropertyData({
        propertyName: property.propertyName || "",
        propertyAssetType: property.propertyAssetType || "",
      });
    }
  }, [isEditMode, property]);

  const { data: assetType } = useQuery({
    queryKey: ["getAssetTypes"],
    queryFn: async () => getAllAssets(),
  });

  useEffect(() => {
    if (assetType?.assets) {
      setSelectedAssetType(assetType.assets);
    }
  }, [assetType]);

  // Form validation based on input values
  useEffect(() => {
    setIsFormValid(!!propertyData.propertyName);
  }, [propertyData]);

  // Handle form submission
  const handleSaveProperty = async () => {
    if (!isFormValid) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const dataSend = {
        propertyName: propertyData.propertyName,
        propertyAssetType: propertyData.propertyAssetType,
      };

      const response = await addPropertyData(JSON.stringify(dataSend));

      if (response?.success) {
        setSuccessMessage(
          isEditMode
            ? "Property updated successfully!"
            : "Property added successfully!"
        );
        setTimeout(onSuccess, 2000); // Trigger onSuccess after a short delay
      } else if (response?.error) {
        setErrorMessage(response.error);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to save property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        {isEditMode ? "Edit Property" : "Add Property"}
      </h2>

      <div className="w-full flex flex-col p-4">
        {/* Form Input Fields */}
        <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <TextInput
              type="text"
              required
              label="Property Name*"
              values={propertyData.propertyName}
              classNames="text-xs"
              clearOnSuccess={!!successMessage}
              onChange={(value) =>
                setPropertyData({ ...propertyData, propertyName: value })
              }
              placeholder="Enter Property Name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="propertyAssetType"
              className="block text-xs font-semibold mb-2"
            >
              Property Asset Type
            </label>
            <select
              id="propertyAssetType"
              name="propertyAssetType"
              className="w-full rounded-md border text-xs"
              value={propertyData.propertyAssetType}
              onChange={(e) =>
                setPropertyData((prev) => ({
                  ...prev,
                  propertyAssetType: e.target.value,
                }))
              }
            >
              <option value="">Select Asset Type</option>
              {selectedAssetType.map((asset) => (
                <option key={asset.assetTypeId} value={asset.assetTypeId}>
                  {asset.assetType}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={handleSaveProperty}
            className={`bg-blue-500 text-white px-4 py-2 rounded text-sm w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>
        </div>

        {/* Notifications */}
        {successMessage && <SuccessNotification message={successMessage} />}
        {errorMessage && <FailedNotification message={errorMessage} />}
      </div>
    </div>
  );
};

export default AddProperty;
