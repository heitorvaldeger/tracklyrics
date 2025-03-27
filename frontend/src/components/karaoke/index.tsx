export interface KaraokeProps {
  startTime: string;
  endTime: string;
  line: string;
  currentTime: number;
}

function parseTimestamp(timestamp: string) {
  const [minutes, seconds, milliseconds] = timestamp.split(/[:.]/).map(Number);
  return minutes * 60 + seconds + milliseconds / 1000;
}

export function Karaoke({
  startTime,
  endTime,
  currentTime,
  line,
}: KaraokeProps) {
  const start = parseTimestamp(startTime);
  const end = parseTimestamp(endTime);
  const totalChars = line.length;

  if (currentTime < start) {
    return <p className="font-semibold text-muted-foreground">{line}</p>;
  }

  const progress = Math.min(1, (currentTime - start) / (end - start));
  const highlightedIndex = Math.floor(progress * totalChars);

  return (
    <p className="font-semibold">
      {line.split("").map((char, i) => (
        <span
          key={i}
          className={
            i < highlightedIndex ? "text-gray-800" : "text-muted-foreground"
          }
        >
          {char}
        </span>
      ))}
    </p>
  );
}
