import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import { useParams } from "react-router";

import { fetchGame } from "@/api/fetch-game";
import { fetchVideo } from "@/api/fetch-video";
import { Karaoke } from "@/components/karaoke";
import { Progress } from "@/components/ui/progress";
import { GameModesHash } from "@/models/game-modes";

import { GamePlayHeader } from "./game-play-header";
import { GamePlaySkeleton } from "./game-play-skeleton";

// Animation variants for Framer Motion
const currentLineVariants = {
  hidden: {
    opacity: 1,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      duration: 0.4,
    },
  },
};

const nextLineVariants = {
  hidden: {
    opacity: 0.6,
    y: 20,
  },
  visible: {
    opacity: 0.6,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.4,
      delay: 0.1,
    },
  },
};

export const GamePlay = () => {
  const { videoUuid, mode } = useParams();
  const playerRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);

  const { data: video } = useQuery({
    queryFn: () => fetchVideo({ uuid: videoUuid ?? "" }),
    queryKey: ["video", videoUuid],
    enabled: !!videoUuid,
    refetchOnWindowFocus: false,
  });

  const { data: lyrics } = useQuery({
    queryKey: ["game", videoUuid, mode],
    queryFn: () =>
      fetchGame({
        videoUuid: videoUuid ?? "",
        mode: (mode as GameModesHash) ?? GameModesHash.BEGINNER,
      }),
    enabled: !!video,
    refetchOnWindowFocus: false,
  });

  const currentTimePercent = (currentTime * 100) / durationTime;

  const activeLineIndex = useMemo(() => {
    if (!lyrics || !lyrics.length) return -1;

    const isLastLine = currentTime >= lyrics[lyrics.length - 1].startTimeMs;
    const passEndTimeLastLine =
      currentTime >= lyrics[lyrics.length - 1].endTimeMs;

    if (passEndTimeLastLine) {
      return -1;
    }
    if (isLastLine) {
      return lyrics.length - 1;
    }

    return lyrics.findIndex((lyric, i) => {
      return (
        currentTime >= lyric.startTimeMs &&
        currentTime < lyrics[i + 1].startTimeMs
      );
    });
  }, [currentTime]);

  const nextLineIndex = useMemo(() => {
    if (!lyrics || !lyrics.length || activeLineIndex === lyrics.length - 1) {
      return -1;
    }

    if (currentTime < lyrics[0].startTimeMs) {
      return 0;
    }

    if (activeLineIndex < 0) {
      return activeLineIndex;
    }

    return activeLineIndex + 1;
  }, [currentTime]);

  const renderCurrentLine = () => {
    if (!lyrics) return null;

    const lyric = lyrics[activeLineIndex];
    if (!lyric) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-1 text-2xl font-bold">
        <Karaoke
          currentTime={currentTime}
          startTime={lyric.startTimeMs}
          endTime={lyric.endTimeMs}
          line={
            lyric.words?.map(({ word }: any) => word).join(" ") ?? lyric.line
          }
        />
      </div>
    );
  };

  const renderNextLine = () => {
    if (nextLineIndex < 0 || !lyrics) return null;
    const lyric = lyrics[nextLineIndex];

    return (
      <div className="flex flex-wrap items-center justify-center gap-1 text-lg">
        <Karaoke
          currentTime={currentTime}
          startTime={lyric.startTimeMs}
          endTime={lyric.endTimeMs}
          line={
            lyric.words?.map(({ word }: any) => word).join(" ") ?? lyric.line
          }
        />
      </div>
    );
  };

  if (!video || !lyrics) {
    return <GamePlaySkeleton />;
  }

  return (
    <div className="container max-w-5xl mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Header game play */}
        <GamePlayHeader
          title={video.title}
          artist={video.artist}
          isFavorite={video.isFavorite}
          videoUuid={video.uuid}
        />
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex flex-col gap-1">
          <Progress value={currentTimePercent} className="bg-gray-200" />

          <ReactPlayer
            ref={playerRef}
            url={video.linkYoutube}
            width="100%"
            height="100%"
            style={{
              objectFit: "contain",
            }}
            progressInterval={1}
            onReady={(e) => {
              setDurationTime(e.getDuration());
            }}
            onProgress={(state) => setCurrentTime(state.playedSeconds)}
          />
        </div>
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Current line */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`current-${activeLineIndex}`}
              className="text-center w-full"
              variants={currentLineVariants}
              initial="hidden"
              animate="visible"
            >
              {renderCurrentLine()}
            </motion.div>
          </AnimatePresence>

          {/* Next line */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`current-${nextLineIndex}`}
              className="text-center w-full"
              variants={nextLineVariants}
              initial="hidden"
              animate="visible"
            >
              {renderNextLine()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
