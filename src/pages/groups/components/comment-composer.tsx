import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Content } from "@tiptap/react";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";

interface CommentComposerProps {
  value: Content;
  setValue: (value: Content) => void;
  handleComment: () => void;
  isLoading?: boolean;
}

const CommentComposer: React.FC<CommentComposerProps> = ({
  value,
  setValue,
  handleComment,
  isLoading,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return null;

  return (
    <div className="mt-8">
      <Separator />
      <div className="flex gap-2 py-4">
        <Avatar>
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.common_info.name
            )}&size=32`}
            alt={user.common_info.name}
          />
          <AvatarFallback>{user.common_info.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center">
            <span className="font-semibold mt-2">Write a comment</span>
          </div>
          <div className="mt-2">
            <MinimalTiptapEditor
              value={value}
              onChange={setValue}
              className="w-full"
              editorContentClassName="p-5"
              output="html"
              placeholder="Type your description here..."
              editable={true}
              editorClassName="focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleComment}
              disabled={isLoading || isEmpty(value)}
            >
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentComposer;
