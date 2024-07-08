import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  try {
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching post: ${error}` },
      { status: 500 }
    );
  }
}

export interface DeletePostRequesBody {
  userId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  auth().protect(); // protect the route with Clerk authentication
  await connectDB();

  //   const user = await currentUser();
  const { userId }: DeletePostRequesBody = await request.json();

  try {
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // if (post.user.userId !== user?.id) {
    if (post.user.userId !== userId) {
      // throw new Error("Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await post.removePost();
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: `Error deleting post: ${error}` },
      { status: 500 }
    );
  }
}
