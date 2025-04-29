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

import { GameKaraoke } from "./game-karaoke";
import { GamePlayHeader } from "./game-play-header";
import { GamePlaySkeleton } from "./game-play-skeleton";

// Animation variants
const animationVariants = {
  current: {
    hidden: { opacity: 1, y: 20, scale: 0.95 },
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
  },
  next: {
    hidden: { opacity: 0.6, y: 20 },
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
  },
};

export const GamePlay = () => {
  const { videoUuid, mode } = useParams();
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);

  const currentTimePercent = (currentTime * 100) / durationTime;

  const { data: video } = useQuery({
    queryKey: ["video", videoUuid],
    queryFn: () => fetchVideo({ uuid: videoUuid ?? "" }),
    enabled: !!videoUuid,
    refetchOnWindowFocus: false,
  });

  const { data: game } = useQuery({
    queryKey: ["game", videoUuid, mode],
    queryFn: () =>
      fetchGame({
        videoUuid: videoUuid ?? "",
        mode: (mode as GameModesHash) ?? GameModesHash.BEGINNER,
      }),
    enabled: !!video,
    refetchOnWindowFocus: false,
  });

  const activeLineIndex = useMemo(() => {
    if (!game?.lyrics.length) return -1;

    const lastLyric = game.lyrics.at(-1);
    if (!lastLyric) return -1;

    if (currentTime >= lastLyric.endTimeMs) return -1;
    if (currentTime >= lastLyric.startTimeMs) return game.lyrics.length - 1;

    return game.lyrics.findIndex(
      (lyric, i) =>
        currentTime >= lyric.startTimeMs &&
        currentTime < (game.lyrics[i + 1]?.startTimeMs ?? Infinity),
    );
  }, [game, currentTime]);

  const nextLineIndex = useMemo(() => {
    if (!game?.lyrics.length) return -1;
    if (currentTime < game.lyrics[0].startTimeMs) return 0;
    return activeLineIndex >= 0 && activeLineIndex < game.lyrics.length - 1
      ? activeLineIndex + 1
      : -1;
  }, [game, currentTime, activeLineIndex]);

  const getLineText = (lyric: any) =>
    lyric.words?.map(({ word }: any) => word).join(" ") ?? lyric.line;

  const renderLine = (index: number, isCurrent: boolean) => {
    if (!game || index < 0) return null;
    const lyric = game.lyrics[index];
    const LineComponent = isCurrent ? GameKaraoke : Karaoke;

    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-1 ${
          isCurrent ? "text-2xl font-bold" : "text-lg"
        }`}
      >
        <LineComponent
          currentTime={currentTime}
          startTime={lyric.startTimeMs}
          endTime={lyric.endTimeMs}
          line={getLineText(lyric)}
          words={lyric.words ?? []}
        />
      </div>
    );
  };

  if (!video || !game) return <GamePlaySkeleton />;

  return (
    <div className="container max-w-5xl mx-auto">
      <div className="flex flex-col space-y-4">
        <GamePlayHeader
          title={video.title}
          artist={video.artist}
          isFavorite={video.isFavorite}
          videoUuid={video.uuid}
          gaps={game.gaps}
        />

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex flex-col gap-1">
          <Progress value={currentTimePercent} className="bg-gray-200" />
          <ReactPlayer
            ref={playerRef}
            url={video.linkYoutube}
            width="100%"
            height="100%"
            style={{ objectFit: "contain" }}
            progressInterval={1}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onReady={(e) => setDurationTime(e.getDuration())}
            onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
            config={{
              youtube: {
                playerVars: {
                  rel: 0,
                  start: 0,
                  cc_load_policy: 0,
                  disablekb: 1,
                },
              },
            }}
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`current-${activeLineIndex}`}
              className="text-center w-full"
              variants={animationVariants.current}
              initial="hidden"
              animate="visible"
            >
              {renderLine(activeLineIndex, true)}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`next-${nextLineIndex}`}
              className="text-center w-full"
              variants={animationVariants.next}
              initial="hidden"
              animate="visible"
            >
              {renderLine(nextLineIndex, false)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
