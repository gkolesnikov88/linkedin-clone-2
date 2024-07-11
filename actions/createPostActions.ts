"use server";

import { randomUUID } from "crypto";
import { containerName, generateSASToken } from "@/lib/generateSASToken";
import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { revalidatePath } from "next/cache";

import { IUser } from "@/types/user";
import { AddPostRequestBody } from "@/app/api/posts/route";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url: string | undefined;

  if (!postInput.trim()) {
    throw new Error("You must provide post input");
  }

  // define user
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || ""
  };

  try {
    if (image.size > 0) {
      // 1. upload image if there is one - MS blob storage
      console.log("Uploading image to Azure Blob Storage");

      const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const immageArrayBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(immageArrayBuffer);

      image_url = res._response.request.url;
      console.log("File uploaded successfully!", image_url);      

      // 2. create post in database with image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url
      };
      await Post.create(body);
    } else {
      // 2. create post in database
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput
      };

      await Post.create(body);
    }
  } catch (error) {
    console.log(error);    
    throw new Error("Error creating post");
  }
  revalidatePath('/'); // revalidate the home page
}
