/** @format */

import { supabase } from "../../supabaseClient";

// authService.ts

interface AuthResponse {
  status: number;
  data?: any;
  error?: string;
}

const email = "boy69898@gmail.com"; // Replace with your user's email
const password = "Kan0987nepal!";

export const signInWithPassword = async (): Promise<AuthResponse> => {
  const { data: signInData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    console.error("Failed to authenticate:", authError.message);
    return { status: 500, error: "Failed to authenticate" };
  }

  console.log("Authentication successful. User:", signInData);

  return { status: 200, data: signInData };
};

function getRandomTimestampFilename(file: string) {
  const extension = file.split(".").pop();
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
  return `${timestamp}_${randomNum}.${extension}`;
}
const createFolderIfNotExists = async (bucketName: any, folderPath: any) => {
  // List files in the folder to check if it exists
  const { data: listData, error: listError } = await supabase.storage
    .from(bucketName)
    .list(folderPath);

  if (listError && listError.message !== "The resource was not found") {
    console.error(`Error checking folder ${folderPath}:`, listError.message);
    throw new Error(`Failed to check folder ${folderPath}`);
  }

  if (listData && listData.length > 0) {
    // Folder exists
    return;
  }

  // Folder does not exist, create it by uploading a dummy file
  const dummyFilePath = `${folderPath}/.keep`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(dummyFilePath, new Blob([""], { type: "text/plain" }));

  if (uploadError) {
    console.error(`Error creating folder ${folderPath}:`, uploadError.message);
    throw new Error(`Failed to create folder ${folderPath}`);
  }
};

export const uploadFile = async (
  file: File,
  bucketNameWithFolder: string
): Promise<string> => {
  const [bucketName, ...folderParts] = bucketNameWithFolder.split("/");
  const folderPath = folderParts.join("/");
  const filePath = folderPath
    ? `${folderPath}/${getRandomTimestampFilename(file.name)}`
    : getRandomTimestampFilename(file.name);

  // Ensure the folder exists
  if (folderPath) {
    await createFolderIfNotExists(bucketName, folderPath);
  }

  let { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    console.error(`Error uploading ${file.name}:`, error.message);
    throw new Error(`Failed to upload ${file.name}`);
  } else {
    console.log(`${file.name} uploaded successfully`);
  }

  // Get the public URL of the uploaded file
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteFile = async (fileUrl: string) => {
  if (fileUrl) {
    const urlParts = fileUrl.split("/");
    const bucket = urlParts[urlParts.length - 2];
    const filePath = urlParts[urlParts.length - 1];

    // Delete the file from the bucket
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (deleteError) {
      throw deleteError;
    }
  }
};

export const uploadAttachement = async (formDataToSubmit: FormData) => {
  try {
    if (formDataToSubmit) {
      const registeredDocument = formDataToSubmit.get(
        "uploadedDocument"
      ) as File;

      let documentPaths = "";

      // Upload registered documents if provided
      if (registeredDocument) {
        const documentPath = await uploadFile(registeredDocument, "fmtc/chats");
        console.log("Document uploaded to:", documentPath);
        if (documentPath.toString() !== "") {
          documentPaths = documentPath.toString();
        }
      }
      if (documentPaths !== "") {
        return { success: documentPaths };
      } else {
        return { error: "File" };
      }
    }
  } catch (error) {
    console.error("Error in createGroup:", error);
    return { error: "Internal Server Error" };
  }
};
