import { useFormContext } from "react-hook-form";
import ReactPlayer from "react-player";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

import { SaveVideoSchemaValidator } from ".";

export const TabDetails = () => {
  const { genres, languages } = useGenreLanguage();

  const { watch, control } = useFormContext<SaveVideoSchemaValidator>();

  const youtubeURLWatcher = watch("linkYoutube");

  return (
    <TabsContent
      value="details"
      className="flex flex-col w-auto px-1 space-y-4 flex-1 overflow-y-auto py-4"
    >
      <div className="space-y-2">
        <FormField
          control={control}
          name="linkYoutube"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="linkYoutube" className="font-semibold">
                YouTube Video URL *
              </FormLabel>
              <FormControl>
                <Input
                  id="linkYoutube"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormLabel className="text-sm text-muted-foreground">
                Paste the full YouTube URL of the video you want to save
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
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
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title" className="font-semibold">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    required
                    placeholder="Enter the song title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="artist" className="font-semibold">
                  Artist *
                </FormLabel>
                <FormControl>
                  <Input
                    id="artist"
                    required
                    placeholder="Enter the artist name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormField
            control={control}
            name="genreId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="genre" className="font-semibold">
                  Genre *
                </FormLabel>
                <FormControl id="genre">
                  <Select
                    onValueChange={(v) => {
                      if (v) {
                        field.onChange(v);
                      }
                    }}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={control}
            name="languageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="language" className="font-semibold">
                  Language *
                </FormLabel>
                <FormControl id="language">
                  <Select
                    onValueChange={(v) => {
                      if (v) {
                        field.onChange(v);
                      }
                    }}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormField
          control={control}
          name="releaseYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="releaseYear" className="font-semibold">
                Release Year
              </FormLabel>
              <FormControl>
                <Input
                  id="releaseYear"
                  type="number"
                  min={0}
                  className="w-[85px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
};
