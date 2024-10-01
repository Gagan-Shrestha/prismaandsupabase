/** @format */

"use server";

import { error } from "console";

import { isValidAdmin } from "./ValidAdmin";

import prisma from "../../../lib/prisma";
import { isValidTeacher } from "./VAlidTeacher";

export const validateAdmin = async () => {
  const userStatus = await isValidAdmin();

  if (userStatus.success) {
    const userEmail = userStatus?.data;

    try {
      if (!userEmail) {
        return { error: "Invalid Email" };
      }
      const existingUser = await prisma.auth.findFirst({
        where: {
          userInEmail: userEmail.toLowerCase(),
        },
      });
      if (!existingUser) {
        return { error: "User does not exist" };
      }

      const currecntFiscalYear = await prisma.fiscalYear.findFirst({
        where: {
          active: true,
        },
      });
      if (existingUser) {
        return {
          userExist: true,
          userId: existingUser?.userInId,
          data: existingUser,
          year: currecntFiscalYear?.yearId,
        };
      } else {
        return { error: "User does not exist" };
      }
    } catch (error) {
      return { error: "Failed to validate user" };
    }
  } else {
    return { error: "Unauthorized access" };
  }
};

export const VAlidateTeacher = async () => {
  const userStatus = await isValidTeacher();

  if (userStatus.success) {
    const userEmail = userStatus?.data;
    try {
      if (!userEmail) {
        return { error: "Invalid Email" };
      }
      const existingUser = await prisma.auth.findFirst({
        where: {
          userInEmail: userEmail.toLowerCase(),
        },
      });
      if (!existingUser) {
        return { error: "User does not exist" };
      }

      if (existingUser) {
        const currecntFiscalYear = await prisma.fiscalYear.findFirst({
          where: {
            active: true,
          },
        });

        const existingTeacher = await prisma.teacherInfo.findFirst({
          where: {
            userInId: existingUser?.userInId,
          },
        });
        if (!existingTeacher) {
          return { error: "Asset Manager does not exist" };
        }
        return {
          userExist: true,
          userId: existingUser?.userInId,
          data: existingUser,
          year: currecntFiscalYear?.yearId,
          specificId: existingTeacher?.teacherInfoId,
        };
      } else {
        return { error: "User does not exist" };
      }
    } catch (error) {
      return { error: "Failed to validate user" };
    }
  } else {
    return { error: "Unauthorized access" };
  }
};
