import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Button } from "@/components/ui/button";
import { Content } from "@tiptap/react";
import { useEffect, useState } from "react";

const CommentComposer = () => {
  const [value, setValue] = useState<Content>("");

  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <div className="flex flex-col">
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
      <div className="flex justify-end">
        <Button className="mt-2">Submit</Button>
      </div>
    </div>
  );
};

export default CommentComposer;
