/** @format */

"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/auth/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth/auth.config";
import {
  validateAccountant,
  validateAdmin,
  validateAssetManager,
  validateTenant,
} from "./validation/AllRoleValidation";
import { spec } from "node:test/reporters";

export const getSetting = async () => {
  console.log("Roles");
  const session = await getServerSession(authOptions);

  const userRole = session?.user?.role;

  try {
    // Validate each user type
    if (userRole === "Admin") {
      const admin = await validateAdmin();
      if (!admin.error) {
        return getSettingsForUser(admin);
      }
    } else if (userRole === "AssetManager") {
      const assetManager = await validateAssetManager();
      if (!assetManager.error) {
        return getSettingsForUser(assetManager);
      }
    } else if (userRole === "Accountant") {
      const accountant = await validateAccountant();
      if (!accountant.error) {
        return getSettingsForUser(accountant);
      }
    } else {
      const tenant = await validateTenant();
      if (!tenant.error) {
        return getSettingsForUser(tenant);
      }
    }
  } catch (error) {
    return { error: "Invalid User" };
  }
};

const getSettingsForUser = async (user: any) => {
  if (!user) {
    return { error: "Invalid user" };
  }

  try {
    const basicSettingData = await prisma.userSetting.findUnique({
      where: {
        userInId: user?.userId,
      },
    });
    const exisitingSelectedYear = await prisma.fiscalYear.findFirst({
      where: {
        selected: true,
      },
    });
    const currentYear = await prisma.fiscalYear.findFirst({
      where: {
        active: true,
      },
    });

    if (!basicSettingData) {
      return { error: "User settings not found" };
    }

    const data = {
      userId: basicSettingData?.userInId,
      transactionYearId: currentYear?.name,
      selectedYear: exisitingSelectedYear?.name || "",
      languageFormat: basicSettingData?.language,
      fontSize: basicSettingData?.fontSize,
      theme: basicSettingData?.theme,
      initialSetup: basicSettingData.initialSetup,
      chatEnable: basicSettingData.chatEnable,
      specificId: user?.specificId,
    };
    revalidatePath("/");

    return { success: data };
  } catch (error) {
    return { error: "Failed to retrieve settings" };
  }
};
