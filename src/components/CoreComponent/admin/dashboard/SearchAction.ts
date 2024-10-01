/** @format */

"use server";

import prisma from "@/src/lib/auth/prisma";

export const searchUsers = async (
  queryText: string,
  sortField?: string,
  sortOrder?: string,
  filters?: { [key: string]: string | boolean | undefined }
) => {
  let orderBy: { [key: string]: string } | undefined = undefined;
  if (sortField && sortOrder) {
    orderBy = {};
    orderBy[sortField] = sortOrder;
  }

  if (!queryText) {
    return { error: "Invalid search" };
  }

  const whereClause = (fieldName: string) => ({
    [fieldName]: {
      contains: queryText,
      mode: "insensitive",
    },
  });

  const applyFilters = (where: any) => {
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
          where[key] = value;
        }
      }
    }
    return where;
  };

  try {
    // const farmerResults = await prisma.assetManagerInfo.findMany({
    //   where: applyFilters(whereClause("farmerName")),
    //   orderBy: orderBy,
    // });

    // const groupResults = await prisma.groupInfo.findMany({
    //   where: applyFilters(whereClause("groupName")),
    //   orderBy: orderBy,
    // });

    // const officerResults = await prisma.assetManagerInfo.findMany({
    //   where: applyFilters(whereClause("officerName")),
    //   orderBy: orderBy,
    // });

    // const combinedResults = [
    //   ...farmerResults.map((result) => ({ ...result, source: "farmerInfo" })),
    //   ...groupResults.map((result) => ({ ...result, source: "groupInfo" })),
    //   ...officerResults.map((result) => ({ ...result, source: "officerInfo" })),
    //   ...distributorResults.map((result) => ({
    //     ...result,
    //     source: "distributor",
    //   })),
    //   ...wholeSellerResults.map((result) => ({
    //     ...result,
    //     source: "wholeSeller",
    //   })),
    // ];

    // if (combinedResults.length === 0) {
    //   return { error: "No results found" };
    // }

    return { success: "combinedResults" };
  } catch (error) {
    console.error("Error searching data:", error);
    return { error: "Error occurred during search" };
  }
};
