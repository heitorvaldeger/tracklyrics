import { CarouselVideo } from "@/pages/home/components/carousel-video";
import { CarouselNewLyrics } from "@/pages/home/components/carousel-new-lyrics";
import { CarouselTopLyrics } from "@/pages/home/components/carousel-top-lyrics";

export const Home = () => {
  return (
    <div className="mx-auto py-10">
      <CarouselVideo />
      <div className="flex flex-col py-12">
        <CarouselTopLyrics />
        <CarouselNewLyrics />
      </div>
    </div>
  );
};
