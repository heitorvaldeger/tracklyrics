import { Logo } from "@/components/logo";
import { Form as FormProvider } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { useForm } from "react-hook-form";
import { Footer } from "./components/footer";
import { YOUTUBE_LINK_REGEX } from "@/constants/general";

export const VideoAdd = () => {
  const { ...form } = useForm();

  const handleCreateNewVideo = (data: any) => {
    console.log(data);
  };

  const youtubeLinkWatch: string = form.watch("linkYoutube") ?? "";
  const youtubeGroup = youtubeLinkWatch.match(YOUTUBE_LINK_REGEX);
  const youtubeSrc = `https://www.youtube.com/embed/${youtubeGroup ? youtubeGroup[1] : ""}`;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleCreateNewVideo)} className="flex flex-col h-screen">
        <header className="flex items-center gap-4 p-2">
          <Logo />
          <Input placeholder="Copy here the link to the Youtube video" required {...form.register("linkYoutube")} />
          <UserAvatar />
        </header>

        <div className="w-full">
          <iframe width="100%" height={280} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" title="YouTube video player" src={youtubeSrc}></iframe>
        </div>

        <Footer />
      </form>
    </FormProvider>
  );
};
