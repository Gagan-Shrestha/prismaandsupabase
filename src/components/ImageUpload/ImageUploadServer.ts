"use server";

import { uploadFile } from "@/app/SigninWIthsupabase";
import prisma from "@/lib/prisma";

export const createData = async (AllData: FormData) => {
  if (!AllData) {
    return {
      error: "No data Provided",
    };
  }
  try {
    const simpleDatas = AllData.get("simpleData") as string;
    const fphoto = AllData.get("photo");
    if (!AllData) {
      throw new Error("No final data provided");
    }
    const { email, password, photoImage } = JSON.parse(simpleDatas);
    let documentPath = null;
    if (fphoto && fphoto instanceof File) {
      documentPath = (await uploadFile(fphoto, "praticalTrial")).toString();
      console.log("Document uploaded to:", documentPath);
    }

    const user = await prisma.imageUpload.create({
      data: {
        email,
        password,
        photoImage: documentPath,
      },
    });
    return { success: user };
  } catch (error) {
    console.error("Error creating :", error);
    return { error: "Failed to create " };
  }
};
