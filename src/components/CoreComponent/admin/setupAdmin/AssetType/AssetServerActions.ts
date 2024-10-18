"use server";

import prisma from "@/lib/prisma";
import { validateAdmin } from "@/serverActions/validation/AllRoleValidation";

export const createAsset = async (data: string) => {
  const user = await validateAdmin();
  if (user?.error) {
    return {
      error: user.error,
    };
  }

  try {
    const { id, assetType } = JSON.parse(data);
    const asset = await prisma.assetType.findUnique({
      where: {
        assetTypeId: id,
      },
    });

    if (asset) {
      const updateAssetType = await prisma.assetType.update({
        where: {
          assetTypeId: id,
        },
        data: {
          assetType: assetType,
        },
      });
      if (updateAssetType) {
        return {
          success: "Asset updated successfully",
        };
      }
    } else {
      const createAssetType = await prisma.assetType.create({
        data: {
          assetType: assetType,
          userId: user?.userId,
          fiscalYear: user?.year,
        },
      });
      if (createAssetType) {
        return {
          success: "Asset created successfully",
        };
      }
    }
  } catch (error) {
    return {
      error: "Failed to create asset",
    };
  }
};

export const deleteAssetSpecific = async (id: string) => {
  const user = await validateAdmin();
  if (user?.error) {
    return {
      error: user.error,
    };
  }

  try {
    const asset = await prisma.assetType.findUnique({
      where: {
        assetTypeId: id,
      },
    });

    if (asset) {
      const deleteAssetType = await prisma.assetType.delete({
        where: {
          assetTypeId: id,
        },
      });
      if (deleteAssetType) {
        return {
          success: "Asset deleted successfully",
        };
      }
    } else {
      return {
        error: "Asset not found",
      };
    }
  } catch (error) {
    return {
      error: "Failed to delete asset",
    };
  }
};

export const getAllAssets = async () => {
  const user = await validateAdmin();
  if (user?.error) {
    return {
      error: user.error,
    };
  }

  try {
    const assets = await prisma.assetType.findMany({
      where: {
        userId: user?.userId,
      },
    });

    return {
      assets,
    };
  } catch (error) {
    return {
      error: "Failed to fetch assets",
    };
  }
};
