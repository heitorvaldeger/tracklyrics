import { HelpCircle, Loader2Icon, Music, Video } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Navigate } from "react-router";
import { toast } from "sonner";

import { vineResolver } from "@hookform/resolvers/vine";
import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

import { createVideo } from "@/api/create-video";
import { AvatarUser } from "@/components/avatar/avatar-user";
import { Loading } from "@/components/loading";
import { LogoApp } from "@/components/logo-app";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/contexts/session-context";

import { TabDetails } from "./tab-details";
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
  }),
);

export type SaveVideoSchemaValidator = Infer<typeof saveVideoSchemaValidator>;

export const VideoAdd = () => {
  const { hasSession, isLoading } = useSession();

  const form = useForm<SaveVideoSchemaValidator>({
    resolver: vineResolver(saveVideoSchemaValidator),
  });

  const { handleSubmit } = form;

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
  if (!hasSession && !isLoading) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(handleAddNewVideo)}
        className="flex flex-col h-screen"
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

            <TabDetails />
            <TabLyrics />
            <TabHelp />
          </Tabs>
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
        </section>
      </form>
    </FormProvider>
  );
};
