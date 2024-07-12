"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

      <div>
        <Button
          variant="ghost"
          className="postButton"
          // onClick={likeAction}
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
          {/* {user?.id && <CommentForm postId={postId} />}
          <CommentFeed post={post} /> */}
        </div>
      )}
    </div>
  );
}

export default PostOptions;
