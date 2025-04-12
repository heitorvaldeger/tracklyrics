import {
  ArrowDown,
  ArrowUp,
  Import,
  Info,
  Plus,
  SkipBack,
  SkipForward,
  Trash,
} from "lucide-react";
import { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { formatTime } from "@/lib/utils";
import { Lyric } from "@/models/lyric";

import { DialogImport } from "./dialog-import";
import { TableLyricRow } from "./table-lyric-row";

export type LyricWithId = {
  id: number;
} & Lyric;

export const TabLyrics = () => {
  const { watch } = useFormContext();
  const youtubeURLWatcher = watch("linkYoutube");

  const { control, getValues } = useFormContext<{
    lyrics: LyricWithId[];
  }>();
  const {
    fields: lyrics,
    append: appendLyric,
    remove: removeLyric,
    update: updateLyric,
    replace: replaceLyric,
    swap: swapLyric,
  } = useFieldArray({
    control,
    name: "lyrics",
    keyName: "customId",
  });

  const playerRef = useRef<ReactPlayer | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const currentTimeFormated = formatTime(currentTime);
  const durationTimeFormated = formatTime(
    playerRef.current?.getDuration() ?? 0,
  );

  const handleAddNewLine = () => {
    const lastId = lyrics.length > 0 ? lyrics[lyrics.length - 1].id + 1 : 0;

    appendLyric({
      startTime: "",
      endTime: "",
      line: "",
      id: lastId,
    });
  };

  const handleDeleteLine = () => {
    if (selectedLine !== null && selectedLine >= 0) {
      removeLyric(selectedLine);
      setSelectedLine(null);
    }
  };

  const handleMoveUpLine = () => {
    if (selectedLine !== null && selectedLine >= 1) {
      swapLyric(selectedLine, selectedLine - 1);
      setSelectedLine(selectedLine - 1);
    }
  };

  const handleMoveDownLine = () => {
    if (
      selectedLine !== null &&
      selectedLine >= 0 &&
      selectedLine <= lyrics.length - 2
    ) {
      swapLyric(selectedLine, selectedLine + 1);
      setSelectedLine(selectedLine + 1);
    }
  };

  const handleUpdateStartTime = (lyric: LyricWithId) => {
    if (lyric) {
      updateLyric(lyric.id, {
        ...lyric,
        startTime: currentTimeFormated,
      });
    }
  };

  const handleUpdateEndTime = (lyric: LyricWithId) => {
    console.log(getValues());
    if (lyric) {
      updateLyric(lyric.id, {
        ...lyric,
        endTime: currentTimeFormated,
      });
    }
  };

  return (
    <TabsContent
      value="lyrics"
      className="flex flex-col w-full space-y-4 flex-1 overflow-y-auto py-4"
    >
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">
              Lyrics Format Instructions
            </h3>
            <p className="text-sm text-blue-700">
              Enter the complete lyrics with timestamps in the format [MM:SS.ms]
              before each line. Use the video controls below to help you add
              timestamps accurately.
            </p>
          </div>
        </div>
      </div>

      {/* Video player controls for lyrics timing */}
      <div className="bg-slate-100 p-4 rounded-lg space-y-4">
        <div className="mb-4">
          <h3 className="font-medium mb-2">Video Controls</h3>
          {youtubeURLWatcher ? (
            <div className="aspect-video w-full max-h-[250px] rounded-md overflow-hidden border bg-black">
              <ReactPlayer
                url={youtubeURLWatcher}
                width="auto"
                height="250px"
                ref={playerRef}
                progressInterval={1}
                onProgress={(state) => setCurrentTime(state.playedSeconds)}
                controls
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] bg-slate-200 rounded-md border">
              <p className="text-slate-500">
                Add a YouTube URL in the Details tab to preview video
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{currentTimeFormated}</span>
            <span>{durationTimeFormated}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 justify-start">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentTime((state) => {
                    playerRef.current?.seekTo(state - 0.2);
                    return state - 0.2;
                  });
                }}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentTime((state) => {
                    playerRef.current?.seekTo(state + 0.2);
                    return state + 0.2;
                  });
                }}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <DialogImport onReplaceLyric={replaceLyric}>
                <Button type="button">
                  <Import className="h-4 w-4" />
                  Import lyric
                </Button>
              </DialogImport>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleMoveUpLine()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleMoveDownLine()}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddNewLine}
                type="button"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Insert</span>
              </Button>
              <Button
                onClick={handleDeleteLine}
                type="button"
                size="icon"
                variant="outline"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[200px] overflow-y-auto border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-12 font-semibold border-r-2">
                Start Time
              </TableHead>
              <TableHead className="text-left w-12 font-semibold border-r-2">
                End Time
              </TableHead>
              <TableHead className="text-left font-semibold" colSpan={2}>
                Lyric
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lyrics.map((lyric, i) => (
              <TableLyricRow
                key={lyric.customId}
                lyric={{
                  ...lyric,
                  id: i,
                }}
                currentTime={currentTime}
                selectedLine={selectedLine}
                onSelectedLine={setSelectedLine}
                onUpdateStartTime={handleUpdateStartTime}
                onUpdateEndTime={handleUpdateEndTime}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};
