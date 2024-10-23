import { cn } from "@/lib/utils";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { FC, useEffect, useRef, useState } from "react";
import { TableCell } from "../ui/table";

interface DropTableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  resourceId: string;
  columnIndex: number;
}

const DropTableCell: FC<DropTableCellProps> = ({
  children,
  resourceId,
  columnIndex,

  ...props
}) => {
  const ref = useRef<HTMLTableCellElement>(null);
  const [isOver, setIsOver] = useState(false);
  useEffect(() => {
    const element = ref.current!;

    return dropTargetForElements({
      element,
      getData: () => {
        return { resourceId: resourceId, columnIndex: columnIndex };
      },
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => {
        setIsOver(false);
      },
    });
  }, [columnIndex, resourceId]);
  return (
    <TableCell
      className={cn(
        "border",
        isOver && "bg-slate-200",
      )}
      ref={ref}
      {...props}
    >
      <div className="grid grid-flow-row grid-cols-2 gap-2">{children}</div>
    </TableCell>
  );
};

export default DropTableCell;
