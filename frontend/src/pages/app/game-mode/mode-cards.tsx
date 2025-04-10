import { Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GameModes } from "@/models/game-modes";

interface ModeCardsProps {
  modes: GameModes;
  videoUuid: string;
}

export const ModeCards = ({ modes, videoUuid }: ModeCardsProps) => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState("beginner");

  const gameModes = [
    {
      id: "beginner",
      name: "Beginner",
      description: `${modes.beginner.percent}% of words (${modes.beginner.totalFillWords}) are missing. Perfect for beginners learning the song.`,
      color: "bg-green-100 border-green-300 text-green-700",
      hashId: modes.beginner.id,
    },
    {
      id: "intermediate",
      name: "Intermediate",
      description: `${modes.intermediate.percent}% of words (${modes.intermediate.totalFillWords}) are missing. Good for those familiar with the song.`,
      color: "bg-blue-100 border-blue-300 text-blue-700",
      hashId: modes.intermediate.id,
    },
    {
      id: "advanced",
      name: "Advanced",
      description: `${modes.advanced.percent}% of words (${modes.advanced.totalFillWords}) are missing. For those who know the song well.`,
      color: "bg-orange-100 border-orange-300 text-orange-700",
      hashId: modes.advanced.id,
    },
    {
      id: "expert",
      name: "Expert",
      description: `All words (${modes.specialist.totalFillWords}) are missing. The ultimate challenge for experts!`,
      color: "bg-red-100 border-red-300 text-red-700",
      hashId: modes.specialist.id,
    },
  ];

  const handleModeCardClick = () => {
    const mode = gameModes.find((mode) => mode.id === selectedMode);
    if (mode) {
      navigate(`/game/${videoUuid}/play/${mode.hashId}`);
    }
  };

  return (
    <>
      <RadioGroup
        value={selectedMode}
        onValueChange={setSelectedMode}
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        {gameModes.map((mode) => (
          <div
            key={mode.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedMode === mode.id
                ? `${mode.color}`
                : "hover:border-muted-foreground"
            }`}
          >
            <RadioGroupItem value={mode.id} id={mode.id} className="sr-only" />
            <Label
              htmlFor={mode.id}
              className="flex items-start cursor-pointer"
            >
              <div className="flex-1">
                <div className="font-medium text-lg">{mode.name}</div>
                <div className="text-sm text-muted-foreground">
                  {mode.description}
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <Button
        onClick={handleModeCardClick}
        size="lg"
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700"
      >
        <Play className="mr-2 h-4 w-4" />
        Start Game
      </Button>
    </>
  );
};
