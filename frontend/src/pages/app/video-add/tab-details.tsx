import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { useMutation } from "react-query";
import { toast } from "sonner";

import { vineResolver } from "@hookform/resolvers/vine";
import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

import { createVideo } from "@/api/create-video";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { useGenreLanguage } from "@/contexts/genre-language-context";

import { useVideoAdd } from "./contexts/video-add-context";

const youtubeLinkRegex =
  /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const saveVideoSchemaValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    artist: vine.string().trim().minLength(3),
    isDraft: vine.boolean().optional(),
    releaseYear: vine
      .string()
      .trim()
      .fixedLength(4)
      .regex(/^[0-9]+$/),
    linkYoutube: vine.string().regex(youtubeLinkRegex).url(),
    languageId: vine.number(),
    genreId: vine.number(),
  }),
);

export type SaveVideoSchemaValidator = Infer<typeof saveVideoSchemaValidator>;

export const TabDetails = () => {
  const { genres, languages } = useGenreLanguage();
  const { updateYoutubeURL } = useVideoAdd();

  const { handleSubmit, watch, register, control } =
    useForm<SaveVideoSchemaValidator>({
      resolver: vineResolver(saveVideoSchemaValidator),
    });

  const youtubeURLWatcher = watch("linkYoutube");

  useEffect(() => {
    updateYoutubeURL(youtubeURLWatcher);
  }, [youtubeURLWatcher]);

  const { mutateAsync: createVideoFn, isLoading: isCreatingVideo } =
    useMutation({
      mutationFn: createVideo,
    });

  const handleAddNewVideo = async (data: SaveVideoSchemaValidator) => {
    try {
      await createVideoFn(data);
      toast.success("Video created with success!");
    } catch (error) {
      toast.error("Whoops! An error occured, try again!");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddNewVideo)}>
      <TabsContent
        value="details"
        className="flex flex-col w-auto px-1 space-y-4 flex-1 overflow-y-auto py-4"
      >
        <div className="space-y-2">
          <Label htmlFor="linkYoutube">YouTube Video URL *</Label>
          <Input
            id="linkYoutube"
            required
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full"
            {...register("linkYoutube")}
          />
          <p className="text-sm text-muted-foreground">
            Paste the full YouTube URL of the video you want to add
          </p>
        </div>

        {youtubeURLWatcher && (
          <div className="space-y-2">
            <Label>Video Preview</Label>
            <div className="rounded-md border">
              <ReactPlayer url={youtubeURLWatcher} width="auto" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              required
              placeholder="Enter the song title"
              {...register("title")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artist *</Label>
            <Input
              id="artist"
              required
              placeholder="Enter the artist name"
              {...register("artist")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Controller
              control={control}
              name="genreId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <SelectTrigger id="genre" className="w-full">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>

                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Controller
              control={control}
              name="languageId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>

                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem
                        key={language.id}
                        value={language.id.toString()}
                      >
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="releaseYear">Release year *</Label>
          <Input
            id="releaseYear"
            type="number"
            min={0}
            className="w-[80px]"
            {...register("releaseYear")}
          />
        </div>
      </TabsContent>

      <div className="w-full flex justify-end gap-2 py-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {isCreatingVideo ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
};
