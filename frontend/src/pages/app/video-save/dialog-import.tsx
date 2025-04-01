import { PropsWithChildren, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { LyricWithId } from "./tab-lyrics";

interface DialogImportProps {
  onReplaceLyric: (lyrics: LyricWithId[]) => void;
}
export const DialogImport = ({
  onReplaceLyric,
  children,
}: PropsWithChildren<DialogImportProps>) => {
  const importTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleImportClick = () => {
    if (importTextareaRef.current && importTextareaRef.current.value.trim()) {
      const lyricsImported = importTextareaRef.current.value;
      const lyricsImportedArray: LyricWithId[] = lyricsImported
        .split("\n")
        .filter((line) => !!line)
        .map((line, i) => ({
          id: i,
          startTime: "",
          endTime: "",
          line,
        }));

      onReplaceLyric(lyricsImportedArray);
      setIsOpenDialog(false);
    }
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Import lyrics</DialogTitle>
        <DialogDescription>
          Please, set your track lyrics here, one by one for each line
        </DialogDescription>

        <div className="flex justify-center items-center py-4">
          <Textarea ref={importTextareaRef} required className="w-full h-48" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button">Import</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action replace all lyrics have created
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleImportClick}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
