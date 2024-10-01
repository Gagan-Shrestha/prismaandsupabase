// "use client";

// import React, { useEffect, useState } from "react"; // Import necessary hooks and types from React

// import SuccessNotification from "../UIComponent/Notification/SuccessNotification";
// import FailedNotification from "../UIComponent/Notification/FailedNotification";
// import useEmployeeMutation from "./EmployeeMutation";

// interface AddEmployeeProps {
//   employee?: any; // Optional employee data for editing
//   isEditMode?: boolean; // Boolean to indicate if the form is in edit mode
//   onSuccess?: () => void; // Callback function when employee is added/edited successfully
//   employeeId?: string; // Optional employee ID for editing
// }

// const AddEmployee: React.FC<AddEmployeeProps> = ({
//   employee,
//   isEditMode,
//   onSuccess,
//   employeeId,
// }) => {
//   const { addEmployeeDetails } = useEmployeeMutation(); // Mutation function for adding/editing employee details
//   const [successMessage, setSuccessMessage] = useState(""); // State to store success message
//   const [errorMessage, setErrorMessage] = useState(""); // State to store error message
//   const [photo, setPhoto] = useState<File | null>(null); // State to store uploaded photo
//   const [documents, setDocuments] = useState<File[]>([]); // State to store uploaded documents
//   const [loading, setLoading] = useState(false); // Loading state to manage submission
//   const [addEmployee, setAddEmployee] = useState<{
//     employeeName: "";
//     gender: "";
//     mobile: "";
//     citizenshipNumber: "";
//     photo: File | null;
//   }>({
//     employeeName: "",
//     gender: "",
//     mobile: "",
//     citizenshipNumber: "",
//     photo: null,
//   });

//   // Effect to set form data if editing an existing employee
//   useEffect(() => {
//     const setEmployeeInfo = async () => {
//       if (isEditMode && employee) {
//         const photoFile = employee.photo
//           ? await imageUrlToFile(employee.photo) // Convert employee photo URL to file
//           : null;
//         setAddEmployee({
//           employeeName: employee.employeeName || "",
//           gender: employee.gender || "",
//           mobile: employee.mobile || "",
//           citizenshipNumber: employee.citizenshipNumber || "",
//           photo: photoFile,
//         });
//         setPhoto(employee.photo);
//         setDocuments(employee.documents || []); // Set documents array state
//       }
//     };

//     setEmployeeInfo(); // Call function to set employee info if in edit mode
//   }, [isEditMode, employee]); // Re-run effect if isEditMode or employee changes

//   // Handle input field changes
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setAddEmployee((prevData) => ({
//       ...prevData,
//       [name]: value, // Update the state with new value based on input field name
//     }));
//   };

//   // Handle photo file input change
//   const handleFileChange = (file: File | null) => {
//     setPhoto(file); // Update photo state with selected file
//   };

//   // Handle multiple document file input change
//   const handleDocumentsChange = (files: File[] | null) => {
//     if (files) {
//       setDocuments(files); // Update documents state with selected files
//     }
//   };

//   // Handle save employee details action
//   const handleSaveEmployee = async () => {
//     setLoading(true); // Set loading state to true
//     const formData = new FormData(); // Create a new FormData object for file uploads
//     try {
//       // Set up employee details for submission
//       const settingEmployee = {
//         employeeId: employeeId || "", // Include employee ID if provided
//         employeeName: addEmployee.employeeName, // Employee name
//         gender: addEmployee.gender, // Employee gender
//         mobile: addEmployee.mobile, // Employee phone number
//         citizenshipNumber: addEmployee.citizenshipNumber, // Employee citizenship number
//       };
//       formData.append("employeeDetails", JSON.stringify(settingEmployee)); // Add employee details as JSON to formData

//       if (photo) {
//         formData.append("employeePhoto", photo); // Append employee photo file to formData
//       }

//       if (documents) {
//         documents.forEach((file) => {
//           formData.append("uploaddocuments", file);
//         });
//       }

//       const response = await addEmployeeDetails(formData); // Submit formData to the server
//       if (response?.success) {
//         setSuccessMessage(response.success);
//         // onSuccess(); // Close modal or handle success
//       } else if (response?.error) {
//         setErrorMessage(response.error);
//       }
//     } catch (error) {
//       setErrorMessage(
//         "There was an error submitting the form. Please try again later."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-4">
//         {isEditMode ? "Edit Employee" : "Add Employe"}
//       </h2>
//       <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {/* Employee Details Form */}
//         <div>
//           <label className="mb-1 block text-xs font-medium">
//             Employee Name
//           </label>
//           <input
//             type="text"
//             name="employeeName"
//             value={addEmployee.employeeName} // Binds value to employeeName state
//             onChange={handleChange} // Updates employeeName state on change
//             className="block w-full rounded-lg border p-2.5 text-xs"
//             placeholder="Enter Employee Name"
//             required // Makes this input field mandatory
//           />
//         </div>
//         <div>
//           <label className="mb-1 block text-xs font-medium">Gender</label>
//           <select
//             name="gender"
//             value={addEmployee.gender} // Binds value to gender state
//             onChange={handleChange} // Updates gender state on change
//             className="block w-full rounded-lg border p-2.5 text-xs"
//           >
//             <option value="" disabled>
//               Select Gender {/* Placeholder option */}
//             </option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>
//         <div>
//           <label className="mb-1 block text-xs font-medium">
//             Employee Phone
//           </label>
//           <input
//             type="text"
//             name="mobile"
//             value={addEmployee.mobile} // Binds value to mobile state
//             onChange={handleChange} // Updates mobile state on change
//             className="block w-full rounded-lg border p-2.5 text-xs"
//             placeholder="Enter Employee Phone"
//             required // Makes this input field mandatory
//           />
//         </div>
//         <div>
//           <label className="mb-1 block text-xs font-medium">
//             Citizenship Number
//           </label>
//           <input
//             type="text"
//             name="citizenshipNumber"
//             value={addEmployee.citizenshipNumber} // Binds value to citizenshipNumber state
//             onChange={handleChange} // Updates citizenshipNumber state on change
//             className="block w-full rounded-lg border p-2.5 text-xs"
//             required // Makes this input field mandatory
//           />
//         </div>
//       </div>

//       {/* Document Upload Components */}
//       <div className="w-full mb-4">
//         <FileUploadMultiple
//           label="Upload Documents" // Label for file upload component
//           allowedTypes={["pdf", "docx", "doc"]} // Allowed file types for upload
//           onFilesSelected={handleDocumentsChange} // Updates documents state on file selection
//         />
//         <div></div>
//         <label className="mb-1 block text-xs font-medium">Photo</label>
//         <PhotoInput
//           values={addEmployee?.photo} // Binds value to photo state
//           onFileSelected={handleFileChange} // Updates photo state on file selection
//           allowedExtensions={["jpg", "jpeg", "png"]} // Allowed file extensions for photo upload
//         />
//       </div>

//       {/* Save Button */}
//       <div className="w-full flex justify-end mb-4">
//         <button
//           onClick={handleSaveEmployee} // Calls save function when the button is clicked
//           className={`bg-blue-500 text-white px-4 py-2 rounded text-sm w-full ${
//             loading ? "opacity-50 cursor-not-allowed" : "" // Apply styles to disable the button and change appearance when loading
//           }`}
//           disabled={loading} // Disable the button to prevent multiple submissions while loading
//         >
//           {loading ? "Saving..." : isEditMode ? "Update" : "Save"}{" "}
//         </button>
//       </div>
//       {successMessage && <SuccessNotification message={successMessage} />}
//       {errorMessage && <FailedNotification message={errorMessage} />}
//     </div>
//   );
// };

// export default AddEmployee; // Export the AddEmployee component
