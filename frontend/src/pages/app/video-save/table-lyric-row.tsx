import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Karaoke } from "@/components/karaoke";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

import { LyricWithId } from "./tab-lyrics";

interface TableLyricRowProps {
  lyric: LyricWithId;
  selectedLine: number | null;
  currentTime: number;
  onSelectedLine: (id: number) => void;
  onUpdateStartTime: (id: number) => void;
  onUpdateEndTime: (id: number) => void;
}

export const TableLyricRow = ({
  lyric,
  selectedLine,
  currentTime,
  onSelectedLine,
  onUpdateStartTime,
  onUpdateEndTime,
}: TableLyricRowProps) => {
  const { register, getValues } = useFormContext();
  const line = getValues(`lyrics.${lyric.id}.line`);
  const [isEditingLine, setIsEditingLine] = useState(false);

  return (
    <TableRow
      className="h-10"
      data-state={selectedLine === lyric.id ? "selected" : null}
      onClick={() => onSelectedLine(lyric.id)}
    >
      <TableCell
        className="text-left w-12 border-r-2 text-muted-foreground"
        onClick={() => onUpdateStartTime(lyric.id)}
      >
        {lyric.startTime}
      </TableCell>
      <TableCell
        className="text-left w-12 border-r-2 text-muted-foreground"
        onClick={() => onUpdateEndTime(lyric.id)}
      >
        {lyric.endTime}
      </TableCell>
      <TableCell
        className="text-left p-0"
        onClick={() => setIsEditingLine(!isEditingLine)}
      >
        {isEditingLine ? (
          <Input
            {...register(`lyrics.${lyric.id}.line`)}
            className={`rounded-none outline-0 px-1 border-none focus-visible:ring-0`}
            autoFocus
            onBlur={() => setIsEditingLine(false)}
          />
        ) : (
          <div className="ml-1">
            <Karaoke
              startTime={lyric.startTime}
              endTime={lyric.endTime}
              line={line}
              currentTime={currentTime}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
