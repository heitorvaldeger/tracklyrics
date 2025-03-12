import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenre } from "@/contexts/GenreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFormContext } from "react-hook-form";

export const VideoForm = () => {
  const { control } = useFormContext();
  const { genres } = useGenre();
  const { languagesWithoutAll } = useLanguage();

  return (
    <div className="space-y-4 flex-1 overflow-y-auto p-2">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Title *</FormLabel>
            <FormControl>
              <Input {...field} required placeholder="Copy here the title of the song lyrics" className="w-6/12 border-gray-400" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="artist"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Artist *</FormLabel>
            <FormControl>
              <Input {...field} required placeholder="Copy here the artist of the song lyrics" className="w-6/12 border-gray-400" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="genreId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Genre *</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                <SelectTrigger className="w-[200px] border-gray-400">
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
      <FormField
        control={control}
        name="languageId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Language *</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                <SelectTrigger className="w-[200px] border-gray-400">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>

                <SelectContent>
                  {languagesWithoutAll?.map((language) => (
                    <SelectItem key={language.id} value={language.id.toString()}>
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
      <FormField
        control={control}
        name="releaseYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Release Year</FormLabel>
            <FormControl>
              <Input {...field} type="number" className="w-[80px] border-gray-400" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
