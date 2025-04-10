import { Heart, HelpCircle, Printer, Share2 } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";

import { addFavorite } from "@/api/add-favorite";
import { deleteFavorite } from "@/api/delete-favorite";
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
import { useSession } from "@/contexts/session-context";
import { Video } from "@/models/video";

interface GamePlayHeaderProps {
  title: string;
  artist: string;
  videoUuid: string;
  isFavorite: boolean;
}

export const GamePlayHeader = ({
  title,
  artist,
  videoUuid,
  isFavorite,
}: GamePlayHeaderProps) => {
  const queryClient = useQueryClient();
  const { hasSession } = useSession();

  const { mutateAsync: addFavoriteFn } = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      const cached = queryClient.getQueryData<Video>(["video", videoUuid]);
      if (cached) {
        queryClient.setQueryData<Video>(["video", videoUuid], {
          ...cached,
          isFavorite: !cached.isFavorite,
        });
      }
    },
  });

  const { mutateAsync: deleteFavoriteFn } = useMutation({
    mutationFn: deleteFavorite,
    onSuccess() {
      const cached = queryClient.getQueryData<Video>(["video", videoUuid]);
      if (cached) {
        queryClient.setQueryData<Video>(["video", videoUuid], {
          ...cached,
          isFavorite: !cached.isFavorite,
        });
      }
    },
  });

  const toggleFavorite = () => {
    if (!hasSession) {
      toast.info("Please, sign in the account to favorite this video!");
      return;
    }
    if (isFavorite && videoUuid) {
      deleteFavoriteFn({ videoUuid });
    }

    if (!isFavorite && videoUuid) {
      addFavoriteFn({ videoUuid });
    }
  };
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
                className={isFavorite ? "text-red-500" : ""}
                onClick={toggleFavorite}
              >
                <Heart className={isFavorite ? "fill-current" : ""} />
                <span className="sr-only">
                  {isFavorite ? "Remove from favorites" : "Add to favorites"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
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
