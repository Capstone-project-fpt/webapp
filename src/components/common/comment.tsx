import { CommentType } from "@/types/common";
import React from "react";
import { MiniTiptapView } from "../minimal-tiptap";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DateDisplay from "./date";

interface CommentProps {
  comment: CommentType;
  actions?: React.ReactNode;
}

const Comment: React.FC<CommentProps> = ({ comment, actions }) => {
  const { content, user, created_at } = comment;
  return (
    <div className="flex gap-2 mb-4">
      {user && (
        <Avatar>
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&size=32`}
            alt={user.name}
          />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="font-semibold">{user?.name}</span>
            {created_at && (
              <p className="text-sm">
                <DateDisplay date={new Date(created_at)} showTime={true} />
              </p>
            )}
          </div>
          {actions}
        </div>
        <div className="">
          <MiniTiptapView value={content} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
