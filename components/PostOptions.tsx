"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { SignedIn, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import CommentFeed from "./CommentFeed";

function PostOptions({ post }: { post: IPostDocument }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
    if (user?.id && post.likes?.includes(user?.id)) {
      setLiked(true);
    }
  }, [post, user]);

  const likeOrUnlikeAction = async () => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const originalLiked = liked;
    const originalLikes = likes;

    const newLikes = liked
      ? likes?.filter(like => like !== user.id)
      : [...(likes ?? []), user.id];

    const body: LikePostRequestBody | UnlikePostRequestBody = {
      userId: user.id
    };

    setLiked(!liked);
    setLikes(newLikes);

    const response = await fetch(
      `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      setLiked(originalLiked);
      setLikes(originalLikes);

      throw new Error("Failed to like/unlike post");
    }

    const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);
    if (!fetchLikesResponse.ok) {
      setLiked(originalLiked);
      setLikes(originalLikes);
      throw new Error("Failed to fetch likes");
    }

    const newLikesData = await fetchLikesResponse.json();

    setLikes(newLikesData);
  };

  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          <p className="text-xs text-gray-500 cursor-pointer">
            {likes?.length || 0} {likes?.length === 1 ? "like" : "likes"}
          </p>
        </div>

        <div>
          <p
            className="text-xs text-gray-500 cursor-pointer"
            onClick={() => setIsCommentOpen(!isCommentOpen)}
          >
            {post?.comments?.length || 0}{" "}
            {post?.comments?.length === 1 ? "comment" : "comments"}
          </p>
        </div>
      </div>

      <div className="flex p-2 justify-between px-2 border-1">
        <Button
          variant="ghost"
          className="postButton"
          onClick={likeOrUnlikeAction}
        >
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
          />
        </Button>

        <Button
          variant="ghost"
          className="postButton"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentOpen && "text-gray-600 fill-gray-600"
            )}
          />
        </Button>

        <Button variant="ghost" className="postButton">
          <Repeat2 className="mr-1" />
          Repost
        </Button>

        <Button variant="ghost" className="postButton">
          <Send className="mr-1" />
          Send
        </Button>
      </div>

      {isCommentOpen && (
        <div className="p-4">
          <SignedIn>
            <CommentFeed post={post} />
          </SignedIn>
          {/* <CommentFeed post={post} /> */}
        </div>
      )}
    </div>
  );
}

export default PostOptions;
