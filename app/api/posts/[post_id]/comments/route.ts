import connectDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

// GET function is used to get all comments of a post
export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    await connectDB();

    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await post.getAllComments();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "Error on fetching comments" },
      { status: 500 }
    );
  }
}

export interface AddCommentRequestBody {
  user: IUser;
  text: string;
}

// POST function is used to add a comment to a post
export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();
  const { user, text }: AddCommentRequestBody = await request.json();
  
  try {
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment: ICommentBase = {
      user: user,
      text: text
    };

    await post.commentOnPost(comment);
    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error on adding comment" },
      { status: 500 }
    );
  }
}
