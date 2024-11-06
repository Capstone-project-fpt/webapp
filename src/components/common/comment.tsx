import { CommentType } from "@/types/common";
import React from "react";
import { MiniTiptapView } from "../minimal-tiptap";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DateDisplay from "./date";

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { content, user } = comment;
  return (
    <div className="flex gap-2 mb-4">
      <Avatar>
        <AvatarImage
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&size=32`}
          alt={user.name}
        />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex flex-col">
          <span className="font-semibold">{user.name}</span>
          <p className="text-sm">
            <DateDisplay date={new Date(comment.created_at)} showTime={true} />
          </p>
        </div>
        <div className="">
          <MiniTiptapView value={content} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
