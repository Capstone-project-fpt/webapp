import React, { FC, useState, useEffect } from "react";

type Shape =
  | "empty-resources"
  | "done"
  | "empty-conversation"
  | "empty-credit-card"
  | "empty-document"
  | "empty-gps"
  | "empty-image"
  | "empty-inbox"
  | "empty-messages"
  | "empty-search"
  | "empty-contact"
  | "empty-task"
  | "empty-visitor"
  | "empty-cart"
  | "disconnect"
  | "restrict-resource"
  | "error";

interface EmptyResourcesProps {
  title?: string;
  content?: string;
  size?: "xs" | "sm" | "lg";
  shape?: Shape;
  children?: React.ReactNode;
}

const EmptyResources: FC<EmptyResourcesProps> = ({
  title,
  content,
  size = "sm",
  shape,
  children,
}) => {
  const [src, setSrc] = useState(
    "https://media.chative.io/placeholders/empty-document.svg"
  );

  useEffect(() => {
    setSrc(
      `https://media.chative.io/placeholders/${shape || "empty-document"}.svg`
    );
  }, [shape]);

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    lg: "text-lg",
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <img src={src} alt="Empty resource" />
      {title && (
        <p className={`title ${sizeClasses[size]} font-bold mt-2`}>{title}</p>
      )}
      {content && (
        <p className={`content ${sizeClasses[size]} mt-1`}>{content}</p>
      )}
      <div className="actions mt-4">{children}</div>
    </div>
  );
};

export default EmptyResources;
