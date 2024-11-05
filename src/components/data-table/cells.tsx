import { cn } from "@/lib/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { SimpleTooltip } from "../custom/simple-tooltip";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import dayjs from "dayjs";

export function TextCell(props: {
  children: React.ReactNode;
  size?: number;
  icon?: React.ReactNode;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const overflowStyle = "text-ellipsis text-nowrap overflow-x-hidden";

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflowing =
          textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsOverflowing(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  return (
    <div className="relative" style={{ minWidth: props.size }}>
      <div className="flex items-center gap-2 absolute inset-0">
        <div className={overflowStyle} ref={textRef}>
          {isOverflowing ? (
            <SimpleTooltip tooltip={props.children}>
              <div className={overflowStyle}>{props.children}</div>
            </SimpleTooltip>
          ) : (
            props.children
          )}
        </div>
        {props.icon && <div>{props.icon}</div>}
      </div>
    </div>
  );
}

export function AvatarCell(props: { src?: string }) {
  return (
    <Avatar className="h-6 w-6">
      <AvatarImage src={props.src} />
    </Avatar>
  );
}

/**
 * This component used dayjs as a date formatter, for custom date formatting please follow this docs
 * https://day.js.org/docs/en/display/format
 * @param props
 * @returns
 */
export function DateCell(props: {
  date: Date;
  ignoreAfterYears?: number;
  format?: string;
}) {
  const { date, ignoreAfterYears, format = "MMM DD, YYYY" } = props;

  const ignore =
    !!ignoreAfterYears &&
    new Date(
      new Date().setFullYear(new Date().getFullYear() + ignoreAfterYears)
    ) < date;
  const timeString = dayjs(date).format(format);
  return <TextCell size={140}>{ignore ? "Never" : timeString}</TextCell>;
}

type ActionItem =
  | "-"
  | {
      item: React.ReactNode;
      onClick: (e: React.MouseEvent) => void | Promise<void>;
      danger?: boolean;
    };

export function ActionCell(props: {
  items?: ActionItem[];
  invisible?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex h-8 w-8 p-0 data-[state=open]:bg-muted",
            props.invisible && "invisible"
          )}
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {props.items?.map((item, index) =>
          item === "-" ? (
            <DropdownMenuSeparator key={index} />
          ) : (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              onClickCapture={() => setOpen(false)}
              className={item.danger ? "text-danger" : ""}
            >
              {item.item}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BadgeCell(props: { badges: string[]; size?: number }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {props.badges.map((badge, index) => (
        <Badge key={index} variant="secondary">
          {badge}
        </Badge>
      ))}
    </div>
  );
}
