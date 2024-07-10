import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models, Model, ObjectId } from "mongoose";
import { Comment, IComment, ICommentBase } from "./comment";

export interface IPostBase {
  user: IUser;
  text: string;
  imageUrl?: string;
  comments?: IComment[];
  likes?: string[];
}

export interface IPost extends IPostBase, Document<ObjectId> {
  createdAt: Date;
  updatedAt: Date;
}

interface IPostMethods {
  likePost(userId: string): Promise<void>;
  unlikePost(userId: string): Promise<void>;
  commentOnPost(comment: ICommentBase): Promise<void>;
  getAllComments(): Promise<IComment[]>;
  removePost(): Promise<void>;
}

interface IPostStatics {
  getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {} // singular instance of a post
interface IPostModel extends Model<IPostDocument>, IPostStatics {} // all posts

const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String }
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
    likes: { type: [String] }
  },
  { timestamps: true }
);

PostSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    console.log("error when liking post", error);
  }
};

PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    console.log("error when unliking post", error);
  }
};

PostSchema.methods.removePost = async function () {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error) {
    console.log("error when removing post", error);
  }
}

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
  try {
    const newComment = await Comment.create(commentToAdd);
    this.comments.push(newComment._id);
    await this.save();
  } catch (error) {
    console.log("error when commenting on post", error);
  }
};

PostSchema.methods.getAllComments = async function () {
  try {
    await this.populate({
      path: "comments",
      options: { sort: { createdAt: -1 } }
    });
    return this.comments;
  } catch (error) {
    console.log("error when getting all comments", error);
  }
};

PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }
      })
      .lean();

    return posts.map((post: IPostDocument) => {
      return {
        ...post,
        _id: (post._id as ObjectId).toString(),
        comments: post.comments?.map((comment: IComment) => {
          return {
            ...comment,
            _id: (comment._id as ObjectId).toString()
          };
        })
      };
    });
  } catch (error) {
    console.log("error when getting all posts", error);
  }
};

export const Post: IPostModel =
  (models.Post as unknown as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);

