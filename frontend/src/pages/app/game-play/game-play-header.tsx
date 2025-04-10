import { Heart, HelpCircle, Printer, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GamePlayHeaderProps {
  title: string;
  artist: string;
}

export const GamePlayHeader = ({ title, artist }: GamePlayHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{artist}</p>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={false ? "text-red-500" : ""}
              >
                <Heart className={false ? "fill-current" : ""} />
                <span className="sr-only">
                  {false ? "Remove from favorites" : "Add to favorites"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {false ? "Remove from favorites" : "Add to favorites"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle />
              <span className="sr-only">Help</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play</DialogTitle>
              <DialogDescription>
                Fill in the missing words in the lyrics as the song plays. Type
                the correct word in each blank space.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>1. Press play to start the song</p>
              <p>2. Type the missing words in the blank spaces</p>
              <p>3. Press Tab to move to the next blank</p>
              <p>4. If you get stuck, click the hint button</p>
              <p>5. Your score increases with each correct word</p>
            </div>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Share2 />
                <span className="sr-only">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share this song</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Printer />
                <span className="sr-only">Print</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print this song</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
