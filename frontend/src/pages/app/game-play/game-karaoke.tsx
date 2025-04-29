import { useState } from "react";

import { BulletInput } from "./bullet-input";

export interface KaraokeProps {
  startTime: number;
  endTime: number;
  line: string;
  currentTime: number;
  words: {
    word: string;
    correctWord: string;
    isGap: boolean;
  }[];
}

export function GameKaraoke({
  startTime,
  endTime,
  currentTime,
  line,
  words,
}: KaraokeProps) {
  const [wordsState, setWordsState] = useState(words);

  const totalChars = line.length;
  const firstWordWithGap = wordsState.find((word) => word.isGap);

  const progress = Math.min(
    1,
    (currentTime - startTime) / (endTime - startTime),
  );
  const highlightedIndex = Math.floor(progress * totalChars);

  const handleUpdateGap = () => {
    setWordsState((state) => {
      return state.map((item) => {
        if (item.correctWord === firstWordWithGap?.correctWord) {
          item.isGap = false;
        }

        return item;
      });
    });
  };

  return (
    <>
      {wordsState?.map((word, wi) => {
        if (!word.isGap) {
          return (
            <span
              key={`${wi}`}
              className={`${wi < highlightedIndex ? "text-black" : "text-muted-foreground"}`}
            >
              {word.correctWord}
            </span>
          );
        }

        return (
          <div
            className={`${wi < highlightedIndex ? "text-black" : "text-muted-foreground"}`}
          >
            <BulletInput
              word={word.correctWord}
              isCurrent={firstWordWithGap?.correctWord === word.correctWord}
              onUpdateGap={handleUpdateGap}
            />{" "}
          </div>
        );
      })}
    </>
  );
}
