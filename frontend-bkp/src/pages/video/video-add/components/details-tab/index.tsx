import { Separator } from "@/components/ui/separator";
import { VideoForm } from "./video-form";
import { VideoDetails } from "./video-details";

export const DetailsTab = () => {
  return (
    <>
      <VideoForm />
      <Separator orientation="vertical" />
      <VideoDetails />
    </>
  );
};
