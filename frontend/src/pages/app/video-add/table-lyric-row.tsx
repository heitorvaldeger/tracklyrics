import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Lyric } from "@/models/lyric";

interface TableLyricRowProps {
  lyric: Lyric;
  selectedLine: number | null;
  onSelectedLine: (id: number) => void;
  onUpdateStartTime: (idLine: number) => void;
  onUpdateEndTime: (idLine: number) => void;
}

export const TableLyricRow = ({
  lyric,
  selectedLine,
  onSelectedLine,
  onUpdateStartTime,
  onUpdateEndTime,
}: TableLyricRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Função para ativar modo de edição
  const handleEdit = () => setIsEditing(true);

  // Função para sair do modo de edição ao clicar fora
  const handleBlur = () => setIsEditing(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <TableRow
      className="h-10"
      data-state={selectedLine === lyric.id ? "selected" : null}
      onClick={() => onSelectedLine(lyric.id)}
    >
      <TableCell
        className="font-mono text-left w-12 border-r-2"
        onClick={() => onUpdateStartTime(lyric.id)}
      >
        {lyric.startTime}
      </TableCell>
      <TableCell
        className="font-mono text-left w-12 border-r-2"
        onClick={() => onUpdateEndTime(lyric.id)}
      >
        {lyric.endTime}
      </TableCell>
      <TableCell onDoubleClick={handleEdit} className="text-left p-0 px-1">
        {isEditing ? (
          <Input
            ref={inputRef}
            defaultValue={lyric.line}
            onBlur={handleBlur}
            className="h-full rounded-xs border-none outline-0 px-0"
          />
        ) : (
          lyric.line
        )}
      </TableCell>
    </TableRow>
  );
};
