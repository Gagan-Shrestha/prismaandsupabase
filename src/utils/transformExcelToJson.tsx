import * as XLSX from "xlsx";

interface ExcelData {
  [key: string]: any;
}
const transformExcelToJson = async (
  file: File
): Promise<{ [key: string]: any }[]> => {
  const reader = new FileReader();

  return new Promise<{ [key: string]: any }[]>((resolve, reject) => {
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        reject("No data found in the file.");
        return;
      }

      const headerRow = jsonData[0] as string[]; // Assuming first row contains headers
      const transformedData = jsonData.slice(1).map((row: any) => {
        const rowData: { [key: string]: any } = {};
        headerRow.forEach((header: string, index: number) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      resolve(transformedData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

const downloadJSON = (
  jsonData: any[],
  fileName: string = "data.json"
): void => {
  const data = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 0);
};

export { transformExcelToJson, downloadJSON };
