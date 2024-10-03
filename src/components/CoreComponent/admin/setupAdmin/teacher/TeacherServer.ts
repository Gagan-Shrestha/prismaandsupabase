"use server";

import { uploadFile } from "@/app/SigninWIthsupabase";
import prisma from "@/lib/prisma";
import { validateAdmin } from "@/serverActions/validation/AllRoleValidation";

import bcrypt from "bcrypt";
import { error } from "console";

export const createTeacher = async (categoryName: FormData) => {
  if (!categoryName) return { error: "Invalid input data" };

  try {
    // Validate admin user
    console.log("Validating admin user...");
    const user = await validateAdmin();
    if (user?.error) {
      console.error("User validation failed:", user.error);
      return { error: user.error };
    }

    console.log("Admin user validated successfully:", user.userId);

    if (user.userId) {
      const teacherData = categoryName.get("teacherData");

      let teacherObtainedData;
      if (teacherData) {
        try {
          teacherObtainedData = JSON.parse(teacherData.toString());
          console.log("Parsed teacher data:", teacherObtainedData);
        } catch (parseError) {
          console.error("Failed to parse teacher data:", parseError);
          return { error: "Invalid teacher data format" };
        }
      }

      if (teacherObtainedData) {
        const { teacherEmail, teacherName, teacherPhone } = teacherObtainedData;

        // Check if the email already exists, but skip if it's the same as the existing user email
        console.log("Checking if email already exists:", teacherEmail);
        const existingUser = await prisma.auth.findFirst({
          where: { userInEmail: teacherEmail.toLowerCase() },
        });

        if (existingUser && existingUser.role !== "Teacher") {
          console.log(
            "Email already exists with a different role:",
            teacherEmail
          );
          return { error: "Email already exists. Cannot add to teacher list" };
        }

        // Upload teacher photo if provided
        const teacherPhoto = categoryName.get("teacherPhoto") as File;
        let documentPathLogo = null;

        if (teacherPhoto) {
          console.log("Uploading teacher photo...");
          documentPathLogo = await uploadFile(teacherPhoto, "praticalTrial");
          console.log("Document uploaded to:", documentPathLogo);
        }

        // If the user exists as an Asset Manager, update the teacher info
        if (existingUser && existingUser.role === "Teacher") {
          console.log("User exists, updating teacher information...");
          await prisma.teacherInfo.update({
            where: { userInId: existingUser.userInId },
            data: {
              teacherName,
              teacherEmail: teacherEmail.toLowerCase(),
              teacherPhone,
              teacherPhoto: documentPathLogo,
              lastUpdatedTimeStamp: new Date(),
            },
          });

          console.log("Manager updated successfully");
          return { success: "Manager updated successfully" };
        } else {
          // Create a new user and add them as an Asset Manager
          console.log("Creating new user and teacher information...");
          const hashedPassword = await bcrypt.hash(teacherPhone, 12);

          // Create user in the auth table
          const userAuth = await prisma.auth.create({
            data: {
              userInEmail: teacherEmail.toLowerCase(),
              userInPassword: hashedPassword,
              userInPhone: teacherPhone,
              userInName: teacherName,
              role: "Teacher",
              userIsVerify: true,
              validEmail: true,
              userIsApproved: true,
              createdAt: new Date(),
            },
          });

          if (!userAuth) {
            console.error("Could not create user in auth table");
            return { error: "Could not create user" };
          }

          console.log("User created in auth table:", userAuth.userInId);

          // Create teacher info in teacherInfo table
          await prisma.teacherInfo.create({
            data: {
              userInId: userAuth.userInId,
              teacherName,
              teacherEmail: teacherEmail.toLowerCase(),
              teacherPhone,
              userId: user?.userId,
              fiscalYear: user?.year,
              teacherPhoto: documentPathLogo,
              lastUpdatedTimeStamp: new Date(),
            },
          });

          console.log("Manager information created successfully");
          return { success: "Account created successfully" };
        }
      } else {
        console.error("Invalid teacher data");
        return { error: "Invalid teacher data" };
      }
    } else {
      console.error("Unauthorized access");
      return { error: "Unauthorized access" };
    }
  } catch (error) {
    console.error("Error creating teacher:", error);
    return { error: "An error occurred. Please try again." };
  }
};

export const getTeacher = async () => {
  try {
    const user = await validateAdmin();
    if (user?.error) {
      return { error: user.error };
    }
    const existingTeacher = await prisma.teacherInfo.findMany({
      where: {
        userId: user?.userId,
      },
    });

    // Return an empty array if no managers are found
    if (existingTeacher.length > 0) {
      return {
        success: existingTeacher,
      };
    } else {
      return {
        error: "No teacher found",
      };
    }
  } catch (error) {
    console.error("Error retrieving teacher:", error);
    return { error: "Failed to retrieve teacher" };
  }
};

// Function to delete an Asset Manager
// Function to delete an Asset Manager
export const deleteTeacher = async (teacherId: string) => {
  console.log("delete ", teacherId);
  try {
    const user = await validateAdmin();
    if (user?.error) return { error: user.error };

    const teacher = await prisma.teacherInfo.findUnique({
      where: {
        teacherInfoId: teacherId, // Ensure this matches your schema's column name
      },
    });

    if (!teacher) return { error: "Manager not found" };

    await prisma.teacherInfo.delete({
      where: {
        teacherInfoId: teacher.teacherInfoId, // Ensure this matches your schema's column name
      },
    });

    return { success: "Manager deleted successfully!" };
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return { error: "Failed to delete teacher" };
  }
};
export const createTeacherBulk = async (teacherDetails: string) => {
  try {
    const user = await validateAdmin();
    if (user?.error) {
      return { error: user?.error };
    }

    if (!teacherDetails) {
      return { error: "No data provided" };
    }

    const parsedDetails = JSON.parse(teacherDetails);

    const createdData: string[] = [];
    const failedData: string[] = [];

    try {
      const result = await prisma.$transaction(
        async (prisma) => {
          // Loop through each teacher object and add them sequentially
          for (let index = 0; index < parsedDetails.length; index++) {
            const detailsObj = parsedDetails[index];

            if (detailsObj) {
              const { teacherName, teacherPhone, teacherEmail } = detailsObj;

              // Skip if critical information is missing
              if (!teacherName || !teacherPhone || !teacherEmail) {
                failedData.push(teacherName || "Unnamed Teacher");
                continue;
              }

              // Check if the user already exists in the auth table based on email
              const existingUser = await prisma.auth.findFirst({
                where: {
                  userInEmail: teacherEmail.toLowerCase(),
                },
              });

              // If the user exists and is already a Teacher, skip this entry
              if (existingUser && existingUser.role === "Teacher") {
                failedData.push(teacherName);
                continue;
              }

              // If no existing user, create a new teacher
              if (!existingUser) {
                const hashedPassword = await bcrypt.hash(teacherPhone, 12);

                const newUser = await prisma.auth.create({
                  data: {
                    userInEmail: teacherEmail.toLowerCase(),
                    userInPassword: hashedPassword,
                    userInPhone: teacherPhone,
                    userInName: teacherName,
                    validEmail: true,
                    role: "Teacher",
                  },
                });

                if (!newUser) {
                  failedData.push(teacherName);
                  continue;
                }

                const currentFiscalYear = await prisma.fiscalYear.findFirst({
                  where: { active: true },
                });

                const teacherInfo = await prisma.teacherInfo.create({
                  data: {
                    teacherName,
                    teacherEmail: teacherEmail.toLowerCase(),
                    teacherPhone,
                    userId: user?.userId,
                    userInId: newUser?.userInId,
                    fiscalYear: currentFiscalYear?.yearId,
                  },
                });

                if (teacherInfo) {
                  createdData.push(teacherName);
                } else {
                  failedData.push(teacherName);
                }
              } else {
                failedData.push(teacherName);
              }
            }
          }
          return { success: "Teachers processed successfully" };
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 12000, // default: 5000
        }
      );

      // Return success message or errors
      if (createdData.length === parsedDetails.length) {
        return { success: "All teachers added successfully" };
      } else {
        return {
          error:
            "Failed to create some teachers. Failed entries: " +
            failedData.join(", "),
        };
      }
    } catch (error) {
      return { error: "Error: " + error };
    }
  } catch (error) {
    console.error("Error creating or updating teachers:", error);
    return { status: 500, error: "Failed to create teachers" };
  }
};
