import * as React from "react";
import "./styles/index.css";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Content, Editor, HTMLContent } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import parser from "html-react-parser";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { MeasuredContainer } from "./components/measured-container";
import { SectionFive } from "./components/section/five";
import { SectionFour } from "./components/section/four";
import { SectionOne } from "./components/section/one";
import { SectionThree } from "./components/section/three";
import { SectionTwo } from "./components/section/two";
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap";
import { useEffect } from "react";
export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={2}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const MinimalTiptapEditor = React.forwardRef<
  HTMLDivElement,
  MinimalTiptapProps
>(({ value, onChange, className, editorContentClassName, ...props }, ref) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  // Reset the editor content when the value changes
  React.useEffect(() => {
    if (editor && value !== editor?.getHTML()) {
      editor.commands.setContent(value!);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      ref={ref}
      className={cn(
        "flex h-auto min-h-36 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary",
        className
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
});

export const MiniTiptapView = ({ value }: { value: Content }) => {
  return (
    <div className={cn("minimal-tiptap-editor", "px-4 py-3 bg-slate-100 rounded")}>
      <div className="ProseMirror">{parser(value as HTMLContent)}</div>
    </div>
  );
};

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";

export default MinimalTiptapEditor;
