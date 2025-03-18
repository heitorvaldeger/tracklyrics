import { Info, Pause, Play, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";

import { TableLyricCell } from "./table-lyric-cell";
import { TableTimeCell } from "./table-time-cell";

export const TabLyrics = () => {
  const playerRef = useRef<ReactPlayer | null>(null);

  const { watch } = useFormContext();
  const youtubeUrlWatcher = watch("youtubeUrl");

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (sec: number) => {
    const hour = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${hour}:${minutes}:${seconds}`;
  };

  const currentTimeFormated = formatTime(currentTime);
  const durationTimeFormated = formatTime(
    playerRef.current?.getDuration() ?? 0,
  );

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
          {youtubeUrlWatcher ? (
            <div className="aspect-video w-full max-h-[200px] rounded-md overflow-hidden border bg-black">
              <ReactPlayer
                url={youtubeUrlWatcher}
                width="auto"
                height={"200px"}
                ref={playerRef}
                onProgress={(state) => setCurrentTime(state.playedSeconds)}
                playing={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
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

          <Slider
            value={[currentTime]}
            max={playerRef.current?.getDuration() ?? 0}
            step={1}
            onValueChange={(value) => {
              playerRef.current?.seekTo(value[0]);
              setCurrentTime(value[0]);
              setIsPlaying(true);
            }}
            className="w-full"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Insert Timestamp at {currentTimeFormated}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Start Time</TableHead>
              <TableHead className="text-left">End Time</TableHead>
              <TableHead className="text-left" colSpan={2}>
                Lyric
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableTimeCell time={formatTime(0)} />
                <TableTimeCell time={formatTime(0)} />
                <TableLyricCell lyric="teste" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};
