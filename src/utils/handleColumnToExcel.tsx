/** @format */

import * as XLSX from "xlsx";
import saveAs from "file-saver";
interface Data {
  name: string;
  email: string;
  country: string;
}

const handleColumnToExcel = (
  columnNames: string[],
  data: Data[],
  fileName: string
) => {
  const header = [columnNames]; // Use an array of arrays for the header row
  const body = data.map((item: any) => [item.name, item.email, item.country]); // Map data to an array of arrays

  const worksheet = XLSX.utils.aoa_to_sheet([...header, ...body]); // Combine header and data
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Upload Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(dataBlob, fileName);
};

export default handleColumnToExcel;

// -----------------------Implementation------------------------------
// const columnNames = ['Name', 'Email', 'Country'];
// const filteredData: any[] = [
//   { name: 'David', email: 'david@example.com', country: 'Sweden' },
//   { name: 'Castille', email: 'castille@example.com', country: 'Spain' },
//   // More data...
// ];
// handleColumnToExcel(columnNames, filteredData, 'sales_data.xlsx');
