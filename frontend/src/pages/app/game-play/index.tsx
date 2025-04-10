import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { Karaoke } from "@/components/karaoke";
import { Progress } from "@/components/ui/progress";
import { parseTimestamp, shuffleArray } from "@/lib/utils";

import { GamePlayHeader } from "./game-play-header";

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

const video = {
  title: "Under Control",
  artist: "Calvin Harris & Alesso",
  linkYoutube: "https://www.youtube.com/watch?v=yZqmarGShxg",
  uuid: "cc0dfad7-648f-459f-a6e6-19be5ccf29b7",
  releaseYear: "2013",
  genre: "Electronica",
  language: "English",
  username: "aurelio.heitor",
  isFavorite: true,
  thumbnail: "https://img.youtube.com/vi/yZqmarGShxg/hqdefault.jpg",
};

const lyrics = [
  {
    line: "I might be anyone",
    startTime: "00:31.56",
    endTime: "00:34.78",
    seq: 1,
  },
  {
    line: "A lone fool out in the sun",
    startTime: "00:35.47",
    endTime: "00:38.28",
    seq: 2,
  },
  {
    line: "Your heartbeat of solid gold",
    startTime: "00:39.11",
    endTime: "00:42.19",
    seq: 3,
  },
  {
    line: "I love you, you'll never know",
    startTime: "00:43.13",
    endTime: "00:45.94",
    seq: 4,
  },
  {
    line: "When the daylight comes, you feel so cold, you know",
    startTime: "00:46.27",
    endTime: "00:52.39",
    seq: 5,
  },
  {
    line: "I'm too afraid of my heart to let you go",
    startTime: "00:53.72",
    endTime: "00:57.80",
    seq: 6,
  },
  {
    line: "Waitin' for the fire to light",
    startTime: "00:58.91",
    endTime: "01:01.61",
    seq: 7,
  },
  {
    line: "Feelin' like we could do right",
    startTime: "01:02.87",
    endTime: "01:05.49",
    seq: 8,
  },
  {
    line: "Be the one that makes tonight",
    startTime: "01:06.50",
    endTime: "01:09.27",
    seq: 9,
  },
  {
    line: "'Cause freedom is a lonely road",
    startTime: "01:10.33",
    endTime: "01:13.43",
    seq: 10,
  },
  {
    line: "We're under control",
    startTime: "01:14.31",
    endTime: "01:15.93",
    seq: 11,
  },
  {
    line: "We're under control",
    startTime: "01:44.91",
    endTime: "01:46.82",
    seq: 12,
  },
  {
    line: "I might be anyone",
    startTime: "01:54.99",
    endTime: "01:58.27",
    seq: 13,
  },
  {
    line: "A lone fool out in the sun",
    startTime: "01:59.00",
    endTime: "02:02.08",
    seq: 14,
  },
  {
    line: "Your heartbeat of solid gold",
    startTime: "02:02.88",
    endTime: "02:05.75",
    seq: 15,
  },
  {
    line: "I love you, you'll never know",
    startTime: "02:06.50",
    endTime: "02:09.56",
    seq: 16,
  },
  {
    line: "When the daylight comes, you feel so cold, you know",
    startTime: "02:10.14",
    endTime: "02:16.93",
    seq: 17,
  },
  {
    line: "I'm too afraid of my heart to let you go",
    startTime: "02:17.50",
    endTime: "02:21.95",
    seq: 18,
  },
  {
    line: "Waitin' for the fire to light",
    startTime: "02:22.70",
    endTime: "02:25.72",
    seq: 19,
  },
  {
    line: "Feelin' like we could do right",
    startTime: "02:26.59",
    endTime: "02:29.55",
    seq: 20,
  },
  {
    line: "Be the one that makes tonight",
    startTime: "02:30.37",
    endTime: "02:33.23",
    seq: 21,
  },
  {
    line: "'Cause freedom is a lonely road",
    startTime: "02:33.98",
    endTime: "02:37.21",
    seq: 22,
  },
  {
    line: "We're under control",
    startTime: "02:37.98",
    endTime: "02:39.66",
    seq: 23,
  },
  {
    line: "Waiting for the fire to light",
    startTime: "02:53.26",
    endTime: "02:56.04",
    seq: 24,
  },
  {
    line: "Feeling like we could do right",
    startTime: "02:57.01",
    endTime: "03:00.13",
    seq: 25,
  },
  {
    line: "Be the one that makes tonight",
    startTime: "03:00.76",
    endTime: "03:03.82",
    seq: 26,
  },
  {
    line: "'Cause freedom is a lonely road",
    startTime: "03:04.47",
    endTime: "03:07.65",
    seq: 27,
  },
  {
    line: "We're under control",
    startTime: "03:08.49",
    endTime: "03:10.25",
    seq: 28,
  },
  {
    line: "We're under control",
    startTime: "03:23.69",
    endTime: "03:25.73",
    seq: 29,
  },
];

export const GamePlay = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);

  const lyricsProcessed = useMemo(() => {
    const allWordPositions = lyrics.flatMap(({ line, seq }, lineIndex) =>
      line.split(/\s+/).map((_, wordIndex) => ({ lineIndex, wordIndex, seq })),
    );

    const positionsToMask = shuffleArray(allWordPositions).slice(0, 20);

    const maskMap: Map<number, Set<Number>> = positionsToMask.reduce(
      (acc, { lineIndex, wordIndex }) => {
        const set = acc.get(lineIndex) ?? new Set();
        set.add(wordIndex);
        acc.set(lineIndex, set);
        return acc;
      },
      new Map(),
    );

    return lyrics.map((lyric, i) => {
      const startTimeMs = parseTimestamp(lyric.startTime);
      const endTimeMs = parseTimestamp(lyric.endTime);

      let newWords: {
        word: string;
        correctWord: string;
        isGap: boolean;
      }[] = [];
      if (maskMap.has(i)) {
        const words = lyric.line.split(/\s+/);
        newWords = words.map((word, wi) => {
          const newWord = maskMap.get(i)?.has(wi)
            ? word
                .split("")
                .map((char) => (/[a-zA-Z0-9]/.test(char) ? "*" : char))
                .join("")
            : word;

          return {
            word: newWord,
            correctWord: word,
            isGap: true,
          };
        });
      }
      return {
        seq: lyric.seq,
        line: lyric.line,
        lineMasked: newWords.map((i) => i.word).join(" "),
        startTimeMs,
        endTimeMs,
        words: !newWords.length ? null : newWords,
      };
    });
  }, []);

  const currentTimePercent = (currentTime * 100) / durationTime;
  const activeLineIndex = lyricsProcessed.findIndex(
    (lyric, i) =>
      currentTime >= lyric.startTimeMs &&
      currentTime <
        (lyricsProcessed[i + 1] ? lyricsProcessed[i + 1].startTimeMs : -1),
  );

  const nextLineIndex =
    activeLineIndex + 1 < lyricsProcessed.length ? activeLineIndex + 1 : -1;

  const renderCurrentLine = () => {
    const lyric = lyricsProcessed[activeLineIndex];
    if (!lyric) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-1 text-2xl font-bold">
        <Karaoke
          currentTime={currentTime}
          startTime={lyric.startTimeMs}
          endTime={lyric.endTimeMs}
          line={lyric.words?.map(({ word }) => word).join(" ") ?? lyric.line}
          highlight="light"
        />
      </div>
    );
  };

  const renderNextLine = () => {
    const lyric = lyricsProcessed[nextLineIndex];

    return (
      <div className="flex flex-wrap items-center justify-center gap-1 text-lg">
        <Karaoke
          currentTime={currentTime}
          startTime={lyric.startTimeMs}
          endTime={lyric.endTimeMs}
          line={lyric.words?.map(({ word }) => word).join(" ") ?? lyric.line}
        />
      </div>
    );
  };

  return (
    <div className="container max-w-5xl mx-auto">
      <div className="flex flex-col space-y-8">
        {/* Header game play */}
        <GamePlayHeader title={video.title} artist={video.artist} />
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/100 to-transparent py-10 px-2">
            <div className="flex flex-col space-y-2">
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
        </div>
      </div>
    </div>
  );
};
