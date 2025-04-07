import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Pencil, Play, User, X } from "lucide-react";
import { useNavigate } from "react-router";

import { Video } from "@/models/video";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type CardVideoProps = {
  video: Video;
  hasActionDelete?: boolean;
  hasActionEdit?: boolean;
  onDelete?: (videoUuid: string) => void;
  onEdit?: (videoUuid: string) => void;
};

export const CardVideo = ({ video, onDelete, onEdit }: CardVideoProps) => {
  const navigate = useNavigate();

  const handleTitleClick = (videoUuid: string) => {
    navigate(`/game/${videoUuid}/modes`);
  };

  return (
    <Card className="sm:w-2/3 md:w-full rounded-lg flex flex-col py-0">
      <CardContent className="p-0 group overflow-hidden relative">
        <div
          className="relative h-36 bg-cover rounded-t-lg bg-center transition-all duration-300 group-hover:opacity-80 group-hover:bg-primary"
          style={{
            backgroundImage: `url(${video.thumbnail})`,
          }}
        >
          {(onDelete || onEdit) && (
            <div className="absolute inset-0 rounded-t-lg bg-black bg-opacity-90 flex items-center justify-end px-4 py-2 opacity-0 group-hover:opacity-90 transition-opacity duration-300">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                {onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent rounded-full hover:bg-black-600 hover:opacity-50 [&_svg]:size-3"
                      >
                        <X color="white" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action couldn't be reverted
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(video.uuid)}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(video.uuid)}
                    className="bg-transparent rounded-full hover:bg-black-600 hover:opacity-50 [&_svg]:size-3"
                  >
                    <Pencil color="white" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <Button
              className="text-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground p-0 text-md font-bold"
              variant="link"
              onClick={() => handleTitleClick(video.uuid)}
            >
              {video.title}
            </Button>
          </div>
          <p className="text-sm font-light">{video.artist}</p>

          <hr className="my-2" />

          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-gray-500" />
            <p className="text-sm text-gray-500">
              {formatDistanceToNowStrict(
                new Date(Number(video.releaseYear), 0),
                {
                  addSuffix: true,
                  locale: ptBR,
                },
              )}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Play size={16} className="text-gray-500" />
            <p className="text-sm text-gray-500">{`${video.qtyViews ?? 0} plays`}</p>
          </div>
          <div className="flex items-center gap-1">
            <User size={16} className="text-gray-500" />
            <p className="text-sm text-gray-500">{`Uploaded by: ${video.username}`}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
