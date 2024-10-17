/** @format */

"use server";
import { uploadFile } from "@/app/SigninWIthsupabase";
import prisma from "@/lib/prisma";
import { validateAdmin } from "@/serverActions/validation/AllRoleValidation";

export const addApplicant = async (applicantData: FormData) => {
  console.log("applicant Data", applicantData);

  const user = await validateAdmin();
  if (user.error) {
    return { error: "Invalid session" };
  }

  if (!applicantData) {
    return { error: "Applicant data is missing" };
  }

  const applicantDetails = applicantData.get("description") as string;
  if (!applicantDetails) {
    return { error: "No document data provided" };
  }

  const parsedDetails = JSON.parse(applicantDetails);
  console.log(parsedDetails);
  const leadType = parsedDetails?.leadType;
  const applicantId = parsedDetails?.applicantId;
  const applicant = parsedDetails?.applicantData;
  const address = parsedDetails?.address;
  const academics = parsedDetails?.academics;
  const score = parsedDetails?.score;
  const summary = parsedDetails?.summary;

  let applicantDocuments: string[] = [];
  const files = applicantData.getAll("applicantData") as File[];
  if (files.length > 0) {
    for (let file of files) {
      if (file instanceof File) {
        const filePath = await uploadFile(file, "elearning/applicant");
        console.log("File uploaded to:", filePath);
        applicantDocuments.push(filePath.toString());
      }
    }
  }

  const existingApplicant = await prisma.applicant?.findUnique({
    where: { applicantId: applicantId },
  });

  if (existingApplicant) {
    // Update existing applicant

    const updateApplicant = await prisma.applicant?.update({
      where: { applicantId: applicantId },
      data: {
        name: applicant?.name,
        userId: user.userId,
        email: applicant?.email,
        secondaryEmail: applicant?.secondaryEmail,
        phoneNumber: applicant?.phoneNumber,
        secondaryPhone: applicant?.secondaryPhone,
        dateOfBirth: applicant?.dateOfBirth,
        gender: applicant?.gender,
        reference: applicant?.reference,
        interestedCountries: applicant?.interestedCountries,
        interestedCourse: applicant?.interestedCourse,
        tags: applicant?.tags,
        counselor: applicant?.counselor,
        quickAppointment: applicant?.quickAppointment,
        checkboxEmail: applicant?.checkboxemail,
        applicationType: leadType,
        summary,
        address: {
          update: {
            where: { addressId: address?.addressId },
            data: {
              countryName: address?.countryName,
              city: address?.city,
              state: address?.state,
              district: address?.district,
              municipality: address?.municipality,
              zipPostal: address?.zipPostal,
              street: address?.street,
            },
          },
        },
        academicRecords: {
          update: academics.map((rec: any) => ({
            where: {
              academicId: rec?.id,
            },
            data: {
              institution: rec?.institution,
              degreeTitle: rec?.degreeTitle,
              degreeLevel: rec?.degreeLevel,
              passedYear: rec?.passedYear,
              courseStart: rec?.courseStart,
              courseEnd: rec?.courseEnd,
              subject: rec?.subject,
              percentage: parseFloat(rec?.percentage) || null,
              gpa: parseFloat(rec?.gpa) || null,
              gradeType: rec?.gradeType,
            },
          })),
        },
        testScores: {
          update: score.map((test: any) => ({
            where: {
              testId: test?.id,
            },
            data: {
              testType: test?.testType,
              overall: test?.overall,
              listening: test?.listening,
              reading: test?.reading,
              writing: test?.writing,
              speaking: test?.speaking,
              attendedDate: test?.attendedDate,
            },
          })),
        },
        documents: {
          create: applicantDocuments.map((fileUrl) => ({
            fileUrl,
          })),
        },
      },
    });
    if (updateApplicant) {
      return {
        success: "Applicant Details updated successfully",
      };
    } else {
      return {
        error: "Failed to update the applicant details ",
      };
    }
  } else {
    const lastApplicant = await prisma.applicant.findFirst({
      where: {
        fiscalYear: user.year,
      },
      orderBy: {
        customId: "desc", // Order by customId in descending order to get the last one
      },
    });

    let nextCustomId: string;
    if (lastApplicant?.customId) {
      // Extract the numeric part of the customId and increment it
      const lastCustomIdNumber = parseInt(
        lastApplicant.customId.split("-")[1],
        10
      );
      nextCustomId = `CLIENT-${(lastCustomIdNumber + 1)
        .toString()
        .padStart(4, "0")}`; // Increment and pad the number
    } else {
      // Start with 0001 if no applicant exists for the fiscal year
      nextCustomId = ` "CLIENT"-0001`;
    }
    const newApplicant = await prisma.applicant?.create({
      data: {
        name: applicant?.name,
        customId: nextCustomId,
        fiscalYear: user.year,
        userId: user.userId,
        email: applicant?.email,
        secondaryEmail: applicant?.secondaryEmail,
        phoneNumber: applicant?.phoneNumber,
        secondaryPhone: applicant?.secondaryPhone,
        dateOfBirth: applicant?.dateOfBirth,
        gender: applicant?.gender,
        reference: applicant?.reference,
        interestedCountries: applicant?.interestedCountries,
        interestedCourse: applicant?.interestedCourse,
        tags: applicant?.tags,
        counselor: applicant?.counselor,
        quickAppointment: applicant?.quickAppointment,
        checkboxEmail: parsedDetails?.checkboxEmail,
        applicationType: leadType || "Leads",
        summary,
        address: {
          create: {
            countryName: address?.countryName,
            city: address?.city,
            state: address?.state,
            district: address?.district,
            municipality: address?.municipality,
            zipPostal: address?.zipPostal,
            street: address?.street,
          },
        },
        academicRecords: {
          create: academics.map((rec: any) => ({
            institution: rec?.institution,
            degreeTitle: rec?.degreeTitle,
            degreeLevel: rec?.degreeLevel,
            passedYear: rec?.passedYear,
            courseStart: rec?.courseStart,
            courseEnd: rec?.courseEnd,
            subject: rec?.subject,
            percentage: parseFloat(rec?.percentage) || null,
            gpa: parseFloat(rec?.gpa) || null,
            gradeType: rec?.gradeType,
          })),
        },
        testScores: {
          create: score.map((test: any) => ({
            testType: test?.testType,
            overall: test?.overall,
            listening: test?.listening,
            reading: test?.reading,
            writing: test?.writing,
            speaking: test?.speaking,
            attendedDate: test?.attendedDate,
          })),
        },
        documents: {
          create: applicantDocuments.map((fileUrl) => ({
            fileUrl,
          })),
        },
      },
    });
    if (newApplicant) {
      return {
        success: "Applicant Details added successfully",
      };
    } else {
      return {
        error: "Failed to add the applicant details ",
      };
    }
  }
};

export const getApplicantDetails = async () => {
  const user = await validateAdmin();
  if (user.error) {
    return { error: "Invalid session" };
  }

  try {
    const existingApplicant = await prisma.applicant?.findMany({
      where: {},
      include: {
        academicRecords: true,
        address: true,
        documents: true,
        testScores: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingApplicant) {
      return {
        success: existingApplicant,
      };
    } else {
      return {
        error: "No applicants found",
      };
    }
  } catch (error) {
    console.error("error", error);
    return {
      error: error,
    };
  }
};

export const deleteApplicant = async (applicantId: string) => {
  console.log("applicant Id ", applicantId);
  // Validate user
  const user = await validateAdmin();
  if (!user) {
    return { error: "Invalid User" };
  }
  try {
    const existingApplicant = await prisma.applicant.findMany({
      where: {
        applicantId: applicantId,
      },
    });

    if (!existingApplicant) {
      return {
        error: "No applicant  found",
      };
    }

    const deleteAd = await prisma.applicant.delete({
      where: {
        applicantId: applicantId,
      },
    });

    if (!deleteAd) {
      return { error: "Unable to delete applicant " };
    }

    return { success: "applicant category deleted successfully" };
  } catch (error) {
    return { error: "Error during deletion as it is associated with other" };
  }
};

export const deleteFile = async (fileId: string) => {
  console.log("visitor Id", fileId);
  try {
    // Validate user
    const user = await validateAdmin();
    if (user?.error) {
      return { error: user.error };
    }

    // Delete visitor
    const deleteDocument = await prisma.document.delete({
      where: {
        documentId: fileId,
      },
    });

    if (!deleteDocument) {
      return { error: "Unable to delete document." };
    }

    return { success: "document deleted successfully." };
  } catch (error) {
    return { error: "Error during visitor deletion." };
  }
};
