import { Info, Plus, Trash } from "lucide-react";
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
import { Lyric } from "@/models/lyric";

import { TableLyricRow } from "./table-lyric-row";

export const TabLyrics = () => {
  const { watch } = useFormContext();
  const youtubeURLWatcher = watch("linkYoutube");

  const { control } = useFormContext<{
    lyrics: Lyric[];
  }>();
  const {
    fields: lyrics,
    append: appendLyric,
    remove: removeLyric,
    update: updateLyric,
  } = useFieldArray({
    control,
    name: "lyrics",
  });

  const playerRef = useRef<ReactPlayer | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    const milliseconds = Math.floor((sec % 1) * 100)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  const currentTimeFormated = formatTime(currentTime);
  const durationTimeFormated = formatTime(
    playerRef.current?.getDuration() ?? 0,
  );

  const handleAddNewLine = () => {
    const lastId = lyrics.length > 0 ? lyrics[lyrics.length - 1].key + 1 : 0;

    appendLyric({
      startTime: "",
      endTime: "",
      line: "",
      key: lastId,
    });
  };

  const handleDeleteLine = () => {
    if (selectedLine !== null && selectedLine >= 0) {
      removeLyric(selectedLine);
      setSelectedLine(null);
    }
  };

  const handleUpdateStartTime = (id: number) => {
    const lyric = lyrics.find((lyric) => lyric.key === id);
    if (lyric) {
      updateLyric(lyric.key, {
        ...lyric,
        startTime: currentTimeFormated,
      });
    }
  };

  const handleUpdateEndTime = (id: number) => {
    const lyric = lyrics.find((lyric) => lyric.key === id);
    if (lyric) {
      updateLyric(id, {
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

          <div className="flex items-center gap-2 justify-end">
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
              className="flex items-center gap-2"
              variant="outline"
            >
              <Trash className="h-4 w-4" />
            </Button>
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
            {lyrics.map((lyric) => (
              <TableLyricRow
                key={lyric.id}
                lyric={lyric}
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
