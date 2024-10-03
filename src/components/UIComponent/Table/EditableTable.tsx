/** @format */

import React, { useState, useEffect } from "react";

interface EditableTableProps {
  columnNames: string[];
  data: any[];
  onDataChange: (newData: any[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({
  columnNames,
  data,
  onDataChange,
}) => {
  const [editedData, setEditedData] = useState<any[]>([]);

  // Populate editedData when data prop changes
  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const handleCellChange = (
    newValue: string | number,
    rowIndex: number,
    columnName: string
  ) => {
    const newData = [...editedData];
    newData[rowIndex][columnName] = newValue;
    setEditedData(newData);
    onDataChange(newData);
  };

  // Function to handle rendering cell values, replacing empty values with 0 or empty string
  const renderCellValue = (columnName: string, cellValue: any) => {
    if (cellValue === "" || cellValue === null || cellValue === undefined) {
      return columnName.includes("Category") ? "" : 0;
    }
    return cellValue;
  };

  return (
    <table>
      <thead>
        <tr>
          {columnNames.map((columnName: any, columnIndex: number) => (
            <th key={columnIndex}>{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {editedData.map((rowData: any, rowIndex: number) => (
          <tr key={rowIndex}>
            {columnNames.map((columnName: any, columnIndex: number) => (
              <td key={columnIndex}>
                <input
                  type="text"
                  className="border-gray-300 text-xs text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={renderCellValue(columnName, rowData[columnName])}
                  onChange={(e) =>
                    handleCellChange(e.target.value, rowIndex, columnName)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;
