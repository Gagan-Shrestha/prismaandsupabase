"use server";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/app/SigninWIthsupabase";

export const createEmployee = async (formData: FormData) => {
  try {
    const employeeDetails = formData.get("employeeDetails") as string;
    const employeePhoto = formData.get("employeePhoto") as File;
    const files = formData.getAll("uploaddocuments") as File[];
    console.log("check 1", employeeDetails);
    console.log("check 1", employeePhoto);
    console.log("check 1", files);
    const { employeeId, employeeName, gender, mobile, citizenshipNumber } =
      JSON.parse(employeeDetails);

    let photoPath = null;
    if (employeePhoto) {
      const uploadedFile = await uploadFile(employeePhoto, "praticalTrial");
      photoPath = uploadedFile.toString();
    }

    // Handle document uploads
    let uploadDocument: string[] = [];
    if (files && files.length > 0) {
      for (let file of files) {
        const filePath = await uploadFile(file, "praticalTrial");
        uploadDocument.push(filePath);
      }
    }

    if (employeeId) {
      const existingEmployee = await prisma.employeeInfo.findUnique({
        where: { employeeId },
      });
      if (!existingEmployee) return { error: "Employee not found" };

      const existingDocuments = existingEmployee?.documents || [];
      const allFiles = [...existingDocuments, ...uploadDocument];

      const updatedEmployee = await prisma.employeeInfo.update({
        where: { employeeId: existingEmployee.employeeId },
        data: {
          employeeName,
          gender,
          mobile,
          citizenshipNumber,
          photo: photoPath,
          documents: allFiles,
        },
      });
      return { success: "Employee updated successfully!" };
    } else {
      const employeeUser = await prisma.employeeInfo.create({
        data: {
          employeeName,
          gender,
          mobile,
          citizenshipNumber,
          photo: photoPath,
          documents: uploadDocument,
        },
      });
      console.log("check 2", employeeUser);
      return { success: "Employee added successfully!" };
    }
  } catch (error) {
    return { error: "Failed to add or update Employee" };
  }
};

export const getEmployee = async () => {
  try {
    const existingEmployee = await prisma.employeeInfo.findMany();
    return { success: existingEmployee };
  } catch (error) {
    return { error: "Failed to retrieve employee" };
  }
};
export const deleteEmployee = async (employeeId: string) => {
  try {
    const employee = await prisma.employeeInfo.findUnique({
      where: {
        employeeId: employeeId,
      },
    });

    if (!employee) {
      return { error: "employee not found" };
    }

    // Delete tenant
    const deleteEmployee = await prisma.employeeInfo.delete({
      where: {
        employeeId: employeeId,
      },
    });

    if (deleteEmployee) {
      return {
        success: "employee deleted successfully!",
      };
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { error: "Failed to delete employee" };
  }
};
