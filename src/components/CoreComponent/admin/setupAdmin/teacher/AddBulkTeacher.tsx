/** @format */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import handleColumnToExcel from "@/utils/handleColumnToExcel";
import { transformExcelToJson } from "@/utils/transformExcelToJson";
import FileUploadSingle from "@/components/UIComponent/Toast/FileUploadSingle";
import SuccessNotification from "@/components/UIComponent/Notification/SuccessNotification";
import FailedNotification from "@/components/UIComponent/Notification/FailedNotification";
import SubmitButton from "@/components/UIComponent/Notification/SubmitButton";
import EditableTable from "@/components/UIComponent/Table/EditableTable";
import useTeacherMutation from "./TeacherMutation";

function extractRowData(jsonData: any[], columnNames: string[]): any[] {
  return jsonData.map((data: any) => {
    const rowData: any = {};
    columnNames.forEach((columnName) => {
      rowData[columnName] = data[columnName] || ""; // If a column name doesn't exist in the JSON data, set it to an empty string
    });
    return rowData;
  });
}

function mapCategoryDataToNumericRepresentation(
  data: any
): { id: string; name: string; numericValue: number }[] {
  const result: { id: string; name: string; numericValue: number }[] = [];
  let numericValue = 0;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      const name = value.name;
      const id = value.id;
      numericValue++;
      result.push({ id, name, numericValue });
    }
  }

  return result;
}

export default function AddTeacherBulk() {
  const { addBulkTeacher } = useTeacherMutation();
  const [teacherData, setTeacherData] = useState({
    teacherName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [clearOnSuccess, setClearOnSuccess] = useState(false);
  const router = useRouter();

  const genderCategory = [
    {
      id: "male",
      name: "Male",
    },
    {
      id: "female",
      name: "Female",
    },
    {
      id: "other",
      name: "Other",
    },
  ];
  const mappedGenderData =
    mapCategoryDataToNumericRepresentation(genderCategory);
  const columnToMappedCategoryData: { [key: string]: any } = {
    Gender: mappedGenderData,
  };

  function downloadMappedCategoryData(
    categoryData: { [key: string]: any },
    filename: string
  ) {
    let textData = "";

    for (const categoryName in categoryData) {
      if (Object.prototype.hasOwnProperty.call(categoryData, categoryName)) {
        const mappedCategoryData = categoryData[categoryName].map(
          ({ name, numericValue }: { name: string; numericValue: number }) =>
            `${name}: ${numericValue}`
        );
        textData += `${categoryName}:\n${mappedCategoryData.join("\n")}\n\n`;
      }
    }
    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const headerMapping: { [key: string]: string } = {
    teacherName: "teacherName",
    teacherPhone: "teacherPhone",
    teacherEmail: "teacherEmail",
  };

  const columnNames = Object.keys(headerMapping);
  const data = Array.from({ length: columnNames.length }, () => ({}));
  const [editedData, setEditedData] = useState<any[]>([]);

  function downloadFormat(column: any, columnEmptyData: any) {
    handleColumnToExcel(column, columnEmptyData, "student_data.xlsx");
    downloadMappedCategoryData(
      {
        Gender: mappedGenderData,
      },
      "mapped_student_data.json"
    );
  }

  const handleSaveData = () => {
    const updatedData = editedData
      .map((row: any) => {
        const updatedRow: any = {};
        columnNames.forEach((columnName) => {
          if (columnToMappedCategoryData[columnName]) {
            const mappedCategoryData = columnToMappedCategoryData[columnName];
            const numericValue = parseInt(row[columnName]);
            const category = mappedCategoryData.find(
              (item: any) => item.numericValue === numericValue
            );
            const mappedColumnName = headerMapping[columnName];
            updatedRow[mappedColumnName] = category
              ? category.id
              : numericValue;
          } else {
            updatedRow[headerMapping[columnName]] = row[columnName];
          }
        });
        return updatedRow;
      })
      .filter((row) => {
        return row.teacherName && row.teacherName.trim();
      });

    let isEmpty = false;

    updatedData.forEach((row: any) => {
      const { teacherName } = row;
      if (!teacherName || !teacherName.trim()) {
        isEmpty = true;
      }
    });

    if (!isEmpty) {
      setIsFormValid(true);
      const jsonData = updatedData.map((row: any) => ({
        teacherName: String(row.teacherName || ""),
        teacherPhone: String(row.teacherPhone || ""),
        teacherEmail: String(row.teacherEmail || ""),
      }));

      const multipleData = JSON.stringify(jsonData);
      setTeacherData({
        ...teacherData,
        teacherName: multipleData,
      });
    } else {
      setIsFormValid(false);
    }
  };

  const handleFileSelected = async (file: File | null) => {
    if (file) {
      try {
        const data = await transformExcelToJson(file);
        const extractedData = extractRowData(data, columnNames);
        setEditedData(extractedData);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    }
  };

  const handleTeacherSave = async () => {
    setIsLoading(true);
    try {
      if (teacherData.teacherName) {
        const data = await addBulkTeacher(teacherData.teacherName);
        if (data?.success) {
          setSuccessMessage(data?.success);
          setClearOnSuccess(true);
          setErrorMessage("");
          setIsFormValid(false);
          setIsLoading(false);
          setEditedData([]);
        } else if (data?.error) {
          setErrorMessage(data?.error);
          setIsFormValid(false);
          setIsLoading(false);
        } else {
          setErrorMessage("Try again later");
        }
      } else {
        setErrorMessage("Please enter valid input");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Failed to add student data");
    }
  };

  return (
    <div className="p-4">
      <div className="flex md:flex-row flex-col"></div>

      <div className="flex md:flex-row flex-col">
        <div className="w-full space-y-3 p-2 m-2 px-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm font-medium">"Download Format"</p>
          <p className="text-xs font-light">
            "Note: Please do not change the column title for data upload
            accuracy"
          </p>
          <button
            type="button"
            onClick={() => downloadFormat(columnNames, data)}
            className="font flex rounded-lg bg-blue-500 px-4 py-2 text-xs text-white hover:bg-blue-700"
          >
            Download
          </button>
        </div>
        <div className="w-full space-y-3 p-2 m-2 px-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm font-medium mb-4">Upload Format</p>
          <FileUploadSingle
            label="Upload excel format"
            onFileSelected={handleFileSelected}
            allowedTypes={["xls", "xlsx"]}
          />
          <p className="text-xs font-light ">
            Note: Select Gender, make necessary corrections if required and
            click Verify Uploaded Data and then click Add Multiple Students
          </p>
          <button
            onClick={handleSaveData}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Verify Uploaded Data
          </button>
        </div>
      </div>
      <div className="p-2 m-2 border">{errorMessage}</div>
      {editedData.length > 0 && (
        <div className="w-full text-center">
          <div className="h-60 overflow-y-auto">
            <EditableTable
              columnNames={columnNames}
              data={editedData}
              onDataChange={setEditedData}
            />
          </div>
          <SubmitButton
            name="Add Multiple Students"
            isLoading={isLoading}
            isFormValid={isFormValid}
            onClick={handleTeacherSave}
          />
        </div>
      )}
      {successMessage && <SuccessNotification message={successMessage} />}
      {errorMessage && <FailedNotification message={errorMessage} />}
    </div>
  );
}
