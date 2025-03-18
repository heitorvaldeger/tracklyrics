import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";

interface TableLyricCellProps {
  lyric?: string;
}

export const TableLyricCell = ({ lyric }: TableLyricCellProps) => {
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
    <TableCell className="text-left">
      {isEditing ? (
        <Input
          ref={inputRef}
          defaultValue={lyric}
          onBlur={handleBlur}
          className="h-6 rounded-xs px-1"
        />
      ) : (
        <p onClick={handleEdit}>{lyric}</p>
      )}
    </TableCell>
  );
};
