import { useState } from "react";

import { TableCell } from "@/components/ui/table";

interface TableTimeCellProps {
  time: string;
}

export const TableTimeCell = ({ time }: TableTimeCellProps) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <TableCell
      onClick={() => setIsSelected(!isSelected)}
      className={`font-mono text-left w-12 ${isSelected && "bg-zinc-500"}`}
    >
      {time}
    </TableCell>
  );
};
