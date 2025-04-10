import { parseTimestamp } from "@/lib/utils";

export interface KaraokeProps {
  startTime: string | number;
  endTime: string | number;
  line: string;
  currentTime: number;
  highlight?: "dark" | "light";
}

export function Karaoke({
  startTime,
  endTime,
  currentTime,
  line,
  highlight = "dark",
}: KaraokeProps) {
  const start =
    typeof startTime === "number" ? startTime : parseTimestamp(startTime);
  const end = typeof endTime === "number" ? endTime : parseTimestamp(endTime);
  const totalChars = line.length;

  if (currentTime < start) {
    return <p className="font-semibold text-muted-foreground">{line}</p>;
  }

  const progress = Math.min(1, (currentTime - start) / (end - start));
  const highlightedIndex = Math.floor(progress * totalChars);

  return (
    <div className="font-bold">
      {line.split("").map((char, i) =>
        highlight === "dark" ? (
          <span
            key={i}
            className={`${i < highlightedIndex ? "text-black" : "text-muted-foreground"}`}
          >
            {char}
          </span>
        ) : (
          <span
            key={i}
            className={`${i < highlightedIndex ? "text-white" : "text-muted-foreground"}`}
          >
            {char}
          </span>
        ),
      )}
    </div>
  );
}
