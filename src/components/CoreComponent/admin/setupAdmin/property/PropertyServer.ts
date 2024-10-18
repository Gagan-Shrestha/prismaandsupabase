"use server";

import prisma from "@/lib/prisma";
import { validateAdmin } from "@/serverActions/validation/AllRoleValidation";

// Create or Update Property
export const createProperty = async (data: string) => {
  const user = await validateAdmin();
  if (user?.error) {
    return {
      error: user.error,
    };
  }

  try {
    const { id, propertyName, propertyAssetType } = JSON.parse(data);

    // Check if property with propertyId exists
    const property = await prisma.propertyInfo.findUnique({
      where: {
        propertyId: id, // Ensure the correct field is used
      },
    });

    if (property) {
      // Update property
      const updateProperty = await prisma.propertyInfo.update({
        where: {
          propertyId: id,
        },
        data: {
          propertyAssetType: propertyAssetType, // Correct reference
          propertyName: propertyName, // Correct reference
        },
      });
      if (updateProperty) {
        return {
          success: "Property updated successfully",
        };
      }
    } else {
      // Create new property
      const propertyType = await prisma.propertyInfo.create({
        data: {
          propertyName: propertyName,
          propertyAssetType: propertyAssetType,
          userId: user?.userId,
          fiscalYear: user?.year,
        },
      });
      console.log("checkpoint1", propertyType);
      if (propertyType) {
        return {
          success: "Property created successfully",
        };
      }
    }
  } catch (error) {
    return {
      error: "Failed to create or update property",
    };
  }
};

// Delete Property
export const deleteProperty = async (id: string) => {
  const user = await validateAdmin();
  if (user?.error) {
    return {
      error: user.error,
    };
  }

  try {
    // Check if property with propertyId exists
    const property = await prisma.propertyInfo.findUnique({
      where: {
        propertyId: id, // Ensure correct field
      },
    });

    if (property) {
      // Delete property
      const deleteAssetType = await prisma.propertyInfo.delete({
        where: {
          propertyId: id, // Correct field
        },
      });
      if (deleteAssetType) {
        return {
          success: "Property deleted successfully",
        };
      }
    } else {
      return {
        error: "Property not found",
      };
    }
  } catch (error) {
    console.error("Error deleting property:", error);
    return {
      error: "Failed to delete property",
    };
  }
};

// Get All Properties
export const getAllProperty = async () => {
  try {
    const user = await validateAdmin();
    if (user?.error) {
      return { error: user.error };
    }
    const properties = await prisma.propertyInfo.findMany({
      where: {
        userId: user?.userId,
      },
    });

    // Return an empty array if no properties are found
    if (properties.length > 0) {
      return {
        success: properties,
      };
    } else {
      return {
        error: "No properties found",
      };
    }
  } catch (error) {
    console.error("Error retrieving properties:", error);
    return { error: "Failed to retrieve properties" };
  }
};
