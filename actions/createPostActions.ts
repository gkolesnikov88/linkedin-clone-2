'use server'

import { currentUser } from "@clerk/nextjs/server"

export default async function createPostAction(formData: FormData) {
    const user = await currentUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let imageUrl: string | undefined;

    if(!postInput.trim()) {
        throw new Error("You must provide post input");
    }

    // define user

    // upload image if ther eis one

    // create post in database

    // revalidatePath '/' - home page
    
}
