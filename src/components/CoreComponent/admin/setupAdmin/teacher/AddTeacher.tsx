/** @format */
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react"; // Import Suspense

import LoadingComponent from "@/components/UIComponent/Loading/LoadingComponent";
import TextInput from "@/components/UIComponent/InputField/TextInput";
import TextInputPlain from "@/components/UIComponent/InputField/TextInputPlain";
import SuccessNotification from "@/components/UIComponent/Notification/SuccessNotification";
import FailedNotification from "@/components/UIComponent/Notification/FailedNotification";
import PhotoInput from "@/components/UIComponent/InputField/PhotoInput";
import { imageUrlToFile } from "@/utils/URLToFile";
import useTeacherMutation from "./TeacherMutation";

interface AddAssetManagerProps {
  teacher?: any;
  isEditMode?: boolean;
  onSuccess: () => void;
  teacherId?: string;
}

const AddTeacher: React.FC<AddAssetManagerProps> = ({
  teacher,
  isEditMode,
  teacherId,
  onSuccess,
}) => {
  const [teacherData, setTeacherData] = useState({
    teacherName: "",
    teacherPhone: "",
    teacherEmail: "",
  });
  const { addTeacherData } = useTeacherMutation();
  const [teacherPhoto, setTeacherPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();

  // Effect to populate form in edit mode
  useEffect(() => {
    const setTeacherInfo = async () => {
      if (isEditMode && teacher) {
        const photoFile = teacher.teacherPhoto
          ? await imageUrlToFile(teacher.teacherPhoto)
          : null;
        setTeacherData({
          teacherName: teacher.teacherName || "",
          teacherPhone: teacher.teacherPhone || "",
          teacherEmail: teacher.teacherEmail || "",
        });
        setTeacherPhoto(photoFile);
      }
    };

    setTeacherInfo();
  }, [isEditMode, teacher]);

  const handleFileChange = (file: File | null) => {
    setTeacherPhoto(file);
  };

  // Form validation based on input values
  useEffect(() => {
    if (
      teacherData.teacherEmail &&
      teacherData.teacherPhone &&
      teacherData.teacherEmail
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [teacherData]);

  const handleSaveTeacher = async () => {
    if (!isFormValid) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      const assetManagerDetails = JSON.stringify(teacherData);
      formData.append("teacherData", assetManagerDetails);

      if (teacherPhoto) {
        formData.append("teacherPhoto", teacherPhoto);
      }

      const data = await addTeacherData(formData);

      if (data?.success) {
        setSuccessMessage(data.success);
        setTeacherData({
          teacherName: "",
          teacherPhone: "",
          teacherEmail: "",
        });
        setTeacherPhoto(null);
        onSuccess(); // Callback after success
      } else if (data?.error) {
        setErrorMessage(data.error);
        if (data.error === "Invalid session") {
          router.push("/login");
        }
      } else {
        setErrorMessage("Unexpected error. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      setErrorMessage("Failed to add teacher. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <div>
      <Suspense
        fallback={
          <div>
            <LoadingComponent />
          </div>
        }
      >
        <h2 className="text-lg font-semibold mb-4">
          {isEditMode ? "Edit Teacher" : "Add Teacher"}
        </h2>
        <div className="w-full flex p-4">
          <div className="w-full">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextInput
                  type="text"
                  required
                  label="Teacher Name*"
                  values={teacherData?.teacherName}
                  classNames="text-xs"
                  clearOnSuccess={successMessage !== ""}
                  onChange={(value) =>
                    setTeacherData({ ...teacherData, teacherName: value })
                  }
                  placeholder="Enter Teacher Name"
                />
              </div>
              <div className="space-y-2">
                <TextInputPlain
                  type="text"
                  required
                  label="teacher Phone*"
                  values={teacherData?.teacherPhone}
                  classNames="text-xs"
                  clearOnSuccess={successMessage !== ""}
                  onChange={(value) =>
                    setTeacherData({ ...teacherData, teacherPhone: value })
                  }
                  placeholder="Enter teacher Phone"
                />
              </div>
              <div className="space-y-2">
                <TextInput
                  type="text"
                  required
                  label="Teacher Email*"
                  values={teacherData?.teacherEmail}
                  classNames="text-xs"
                  clearOnSuccess={successMessage !== ""}
                  onChange={(value) =>
                    setTeacherData({ ...teacherData, teacherEmail: value })
                  }
                  placeholder="Enter Teacher Email"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1 text-center block text-xs font-medium dark:text-white">
                Photo
              </label>
              <PhotoInput
                values={teacherPhoto}
                onFileSelected={handleFileChange}
                allowedExtensions={["jpg", "jpeg", "png"]}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={handleSaveTeacher}
            className={`bg-blue-500 text-white px-4 py-2 rounded text-sm w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>
        </div>
        {successMessage && <SuccessNotification message={successMessage} />}
        {errorMessage && <FailedNotification message={errorMessage} />}
      </Suspense>
    </div>
  );
};

export default AddTeacher;
