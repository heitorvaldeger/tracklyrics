import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Lyric } from "@/models/lyric";

interface TableLyricRowProps {
  lyric: Lyric;
  selectedLine: number | null;
  onSelectedLine: (id: number) => void;
  onUpdateStartTime: (id: number) => void;
  onUpdateEndTime: (id: number) => void;
}

export const TableLyricRow = ({
  lyric,
  selectedLine,
  onSelectedLine,
  onUpdateStartTime,
  onUpdateEndTime,
}: TableLyricRowProps) => {
  const { register } = useFormContext();

  return (
    <TableRow
      className="h-10"
      data-state={selectedLine === lyric.key ? "selected" : null}
      onClick={() => onSelectedLine(lyric.key)}
    >
      <TableCell
        className="font-mono text-left w-12 border-r-2"
        onClick={() => onUpdateStartTime(lyric.key)}
      >
        {lyric.startTime}
      </TableCell>
      <TableCell
        className="font-mono text-left w-12 border-r-2"
        onClick={() => onUpdateEndTime(lyric.key)}
      >
        {lyric.endTime}
      </TableCell>
      <TableCell className="text-left p-0">
        <Input
          {...register(`lyrics.${lyric.key}.line`)}
          className="rounded-none outline-0 px-1 border-none focus-visible:ring-0"
        />
      </TableCell>
    </TableRow>
  );
};
