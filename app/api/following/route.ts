import connectDB from "@/mongodb/db";
import { Followers } from "@/mongodb/models/followers";
import { NextResponse } from "next/server";

// GET function is used to get all following users of a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  try {
    await connectDB();

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 }
      );
    }

    const followings = await Followers.getAllFollowing(user_id);

    if (!followings) {
      return NextResponse.json({ error: "Following users not found" }, { status: 404 });
    }

    return NextResponse.json(followings);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching following" },
      { status: 500 }
    );
  }
}