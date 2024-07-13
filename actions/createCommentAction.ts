"use server";

import { AddCommentRequestBody } from "@/app/api/posts/[post_id]/comments/route";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createCommentAction(
  postId: string,
  formData: FormData
) {
  const user = await currentUser();

  const commentInput = (formData.get("commentInput") as string).trim();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  if (!commentInput) {
    throw new Error("Comment input is required");
  }
  if (!postId) {
    throw new Error("Post ID is required");
  }

  const userDB: IUser = {
    userId: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    userImage: user.imageUrl
  };

  const body: AddCommentRequestBody = {
    text: commentInput,
    user: userDB
  };

  const post = await Post.findById(postId);

	if(!post) {
		throw new Error("Post not found");
	}

	const comment: ICommentBase = {
		user: userDB,
		text: commentInput
	};

	try {
		await post.commentOnPost(comment);
		revalidatePath("/");
	} catch (error) {
		throw new Error("Error on adding comment");
	}	
}
