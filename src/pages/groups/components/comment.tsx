import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Content } from "@tiptap/react";
import React, { useEffect, useState } from "react";

const Comment = () => {
  const [value, setValue] = useState<Content>('<h1 class="heading-node">fwefaweoke</h1><p class="text-node">32</p><p class="text-node"><strong>fwef<em>fwefa<s>stagefawefaweffawe</s></em></strong><span style="color: var(--mt-accent-red)"><strong><em><s>fawfefa</s></em></strong></span></p><ol class="list-node"><li><p class="text-node">fawef</p></li><li><p class="text-node">âra</p></li><li><p class="text-node">fafew</p><hr><p class="text-node">eawe</p></li><li><p class="text-node">raer</p></li></ol>');

  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <MinimalTiptapEditor
      value={value}
      onChange={setValue}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Type your description here..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
    />
  );
};

export default Comment;
