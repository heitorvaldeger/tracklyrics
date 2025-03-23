import { HelpCircle, Music, Video } from "lucide-react";
import { Navigate } from "react-router";

import { AvatarUser } from "@/components/avatar/avatar-user";
import { Loading } from "@/components/loading";
import { LogoApp } from "@/components/logo-app";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/contexts/session-context";

import { VideoAddProvider } from "./contexts/video-add-context";
import { TabDetails } from "./tab-details";
import { TabHelp } from "./tab-help";
import { TabLyrics } from "./tab-lyrics";

export const VideoAdd = () => {
  const { hasSession, isLoading } = useSession();

  if (!hasSession && !isLoading) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VideoAddProvider>
      <div className="flex flex-col h-screen">
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
        </section>
      </div>
    </VideoAddProvider>
  );
};
