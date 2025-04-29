import type React from "react";
import { useEffect, useState } from "react";

interface BulletInputProps {
  word: string;
  isCurrent: boolean;
  onUpdateGap: () => void;
}

export const BulletInput = ({
  word,
  isCurrent,
  onUpdateGap,
}: BulletInputProps) => {
  const [userInput, setUserInput] = useState("");
  const [revealedChars, setRevealedChars] = useState<boolean[]>([]);

  // Reseta estado sempre que a palavra muda
  useEffect(() => {
    setRevealedChars(Array(word.length).fill(false));
    setUserInput("");
  }, [word]);

  // Verifica se a palavra foi completada
  useEffect(() => {
    if (userInput.toLowerCase() === word.toLowerCase()) {
      onUpdateGap();
    }
  }, [userInput, word, onUpdateGap]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (/^[a-zA-Z0-9]$/.test(key) || key === "Backspace") {
      e.preventDefault();

      if (key === "Backspace") {
        if (userInput.length > 0) {
          setUserInput((prev) => prev.slice(0, -1));
          setRevealedChars((prev) => {
            const updated = [...prev];
            updated[userInput.length - 1] = false;
            return updated;
          });
        }
        return;
      }

      if (userInput.length >= word.length) return;

      const expectedChar = word[userInput.length].toLowerCase();
      const typedChar = key.toLowerCase();

      if (typedChar === expectedChar) {
        setUserInput((prev) => prev + typedChar);
        setRevealedChars((prev) => {
          const updated = [...prev];
          updated[prev.filter(Boolean).length] = true;
          return updated;
        });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center h-16 w-full">
        {word.split("").map((char, index) =>
          !/[a-zA-Z0-9]/.test(char) ? (
            char
          ) : (
            <span
              key={index}
              className={`text-2xl font-bold ${isCurrent ? "animate-pulse" : ""}`}
            >
              {revealedChars[index] ? char : "•"}
            </span>
          ),
        )}
      </div>

      {isCurrent && (
        <input
          type="text"
          className="absolute opacity-0 pointer-events-none"
          value={userInput}
          onKeyDown={handleKeyDown}
          onChange={() => {}}
          autoFocus
          disabled={userInput === word}
          onBlur={(e) => isCurrent && e.target.focus()}
        />
      )}
    </div>
  );
};
