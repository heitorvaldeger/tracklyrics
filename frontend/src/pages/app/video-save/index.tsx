import { HelpCircle, Loader2Icon, Music, Video } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { Link, Navigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { vineResolver } from "@hookform/resolvers/vine";
import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

import { createVideo } from "@/api/create-video";
import { fetchVideo } from "@/api/fetch-video";
import { fetchVideoLyrics } from "@/api/fetch-video-lyrics";
import { updateVideo } from "@/api/update-video";
import { AvatarUser } from "@/components/avatar/avatar-user";
import { Loading } from "@/components/loading";
import { LogoApp } from "@/components/logo-app";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGenreLanguage } from "@/contexts/genre-language-context";
import { useSession } from "@/contexts/session-context";
import { compareTimeRule } from "@/lib/vinejs/rules/compare-time";
import { Lyric } from "@/models/lyric";

import { TabDetails } from "./tab-details";
import { TabDetailsSkeleton } from "./tab-details-skeleton";
import { TabHelp } from "./tab-help";
import { TabLyrics } from "./tab-lyrics";

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
    lyrics: vine
      .array(
        vine.object({
          line: vine.string().trim().minLength(1),
          startTime: vine
            .string()
            .trim()
            .use(
              compareTimeRule({
                fieldName: "endTime",
                operation: "less",
              }),
            ),
          endTime: vine.string().trim(),
        }),
      )
      .optional(),
  }),
);

export type SaveVideoSchemaValidator = Infer<typeof saveVideoSchemaValidator>;

export const VideoSave = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const uuid = searchParams.get("uuid");
  const { hasSession, isLoading } = useSession();
  const { genres, languages } = useGenreLanguage();

  const { data: videoToEdit, isLoading: isVideoToEditLoading } = useQuery({
    queryFn: () => fetchVideo({ uuid: uuid ?? "" }),
    queryKey: ["video-save", uuid],
    enabled: !!uuid,
    refetchOnWindowFocus: false,
  });

  const { data: videoLyrics } = useQuery({
    queryFn: () => fetchVideoLyrics({ uuid: uuid ?? "" }),
    queryKey: ["video-lyrics", uuid],
    enabled: !!uuid,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: createVideoFn, isLoading: isCreatingVideo } =
    useMutation({
      mutationFn: createVideo,
    });

  const { mutateAsync: updateVideoFn, isLoading: isUpdatingVideo } =
    useMutation({
      mutationFn: updateVideo,
    });

  const genreId = genres.find((genre) => genre.name === videoToEdit?.genre)?.id;
  const languageId = languages.find(
    (language) => language.name === videoToEdit?.language,
  )?.id;
  const lyrics = videoLyrics?.map((lyric, i) => ({
    ...lyric,
    id: i,
  })) as Lyric[] | undefined;

  const form = useForm<SaveVideoSchemaValidator>({
    resolver: vineResolver(saveVideoSchemaValidator),
    values: {
      artist: videoToEdit?.artist ?? "",
      title: videoToEdit?.title ?? "",
      linkYoutube: videoToEdit?.linkYoutube ?? "",
      releaseYear: videoToEdit?.releaseYear ?? "",
      lyrics: lyrics ?? [],
      genreId: genreId ?? 0,
      languageId: languageId ?? 0,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty: isFormDirty },
  } = form;

  const handleSaveVideo = async (data: SaveVideoSchemaValidator) => {
    try {
      if (uuid) {
        await updateVideoFn({ uuid, body: data });
        toast.success("Video updated with success!");
      } else {
        const video = await createVideoFn(data);
        setSearchParams((state) => {
          state.set("uuid", video.uuid);

          return state;
        });
        toast.success("Video created with success!");
      }
    } catch (error) {
      toast.error("Whoops! An error occured, try again!");
    }
  };

  if (!hasSession && !isLoading) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleSaveVideo)}
        className="flex flex-col h-screen"
        key={Number(!!isVideoToEditLoading)}
      >
        <section className="flex items-center justify-between gap-4 p-2">
          <LogoApp />
          <AvatarUser />
        </section>

        <section className="h-full py-2 flex flex-col mx-auto w-8/12">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3 w-auto h-12 mx-1">
              <TabsTrigger
                className="h-full cursor-pointer data-[state=inactive]:text-muted-foreground"
                value="details"
              >
                <Video size={20} />
                Video details
              </TabsTrigger>
              <TabsTrigger
                className="h-full cursor-pointer data-[state=inactive]:text-muted-foreground"
                value="lyrics"
              >
                <Music size={20} />
                Lyrics
              </TabsTrigger>
              <TabsTrigger
                className="h-full cursor-pointer data-[state=inactive]:text-muted-foreground"
                value="help"
              >
                <HelpCircle />
                Help
              </TabsTrigger>
            </TabsList>

            {!isVideoToEditLoading ? <TabDetails /> : <TabDetailsSkeleton />}
            <TabLyrics />
            <TabHelp />
          </Tabs>
          <div className="w-full flex justify-end gap-2 py-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/lyrics">Cancel</Link>
            </Button>
            <Button type="submit" disabled={!isFormDirty}>
              {isCreatingVideo || isUpdatingVideo ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
};
