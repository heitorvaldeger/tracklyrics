import { Controller, useFormContext } from "react-hook-form";
import ReactPlayer from "react-player";

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

export const TabDetails = () => {
  const { genres, languages } = useGenreLanguage();
  const { register, control, watch } = useFormContext();

  const youtubeUrlWatcher = watch("youtubeUrl");

  return (
    <TabsContent
      value="details"
      className="flex flex-col w-full space-y-4 flex-1 overflow-y-auto py-4"
    >
      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">YouTube Video URL *</Label>
        <Input
          id="youtubeUrl"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full"
          {...register("youtubeUrl")}
        />
        <p className="text-sm text-muted-foreground">
          Paste the full YouTube URL of the video you want to add
        </p>
      </div>

      {youtubeUrlWatcher && (
        <div className="space-y-2">
          <Label>Video Preview</Label>
          <div className="aspect-video rounded-md border">
            <ReactPlayer url={youtubeUrlWatcher} width="auto" />
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
            name="genre"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            name="language"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
  );
};
