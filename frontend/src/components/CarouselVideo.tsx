import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import usFlag from "@/assets/images/flags/us.svg"

import "swiper/swiper-bundle.css"
import "./CarouselVideo.css"

const videos = [
  {
    id: 1,
    title: "APT",
    artist: "Rosé, Bruno Mars",
    releaseDate: "3 months",
    playersCount: 13990,
    thumbnail: "https://img.youtube.com/vi_webp/ekr2nIex040/maxresdefault.webp"
  },
  {
    id: 2,
    title: "A Bar Song (Tipsy)",
    artist: "Shaboozey",
    releaseDate: "3 months",
    playersCount: 13990,
    thumbnail: "https://img.youtube.com/vi_webp/t7bQwwqW-Hc/maxresdefault.webp"
  },
  {
    id: 3,
    title: "Forever Young (A7S remix)",
    artist: "David Guetta, Alphaville & Ava Max",
    releaseDate: "3 months",
    playersCount: 13990,
    thumbnail: "https://img.youtube.com/vi_webp/2xUKOMRaPOo/maxresdefault.webp"
  },
  {
    id: 4,
    title: "I'm Good (Blue)",
    artist: "David Guetta & Bebe Rexha",
    releaseDate: "3 months",
    playersCount: 13990,
    thumbnail: "https://img.youtube.com/vi_webp/90RLzVUuXe4/maxresdefault.webp"
  },
  {
    id: 5,
    title: "Outside",
    artist: "Calvin Harris",
    releaseDate: "3 months",
    playersCount: 13990,
    thumbnail: "https://img.youtube.com/vi_webp/J9NQFACZYEU/maxresdefault.webp"
  }
]

export const CarouselVideo = () => {
  return (
    <Swiper pagination={true} modules={[Pagination, Autoplay]} loop autoplay className="h-80 rounded-2xl">
      {
        videos.map(video => (
          <SwiperSlide style={{
              backgroundImage: `url(${video.thumbnail})`
            }}
            key={video.id}
            className='bg-center bg-cover flex justify-start items-end rounded-2xl'
          >
            <div className='px-6 bg-gray-900/[.8] text-white w-full rounded-b-2xl py-1'>
              <div className='flex items-center gap-2'>
                <p className='font-extrabold text-lg'>{video.title}</p>
                <img src={usFlag} width={20} className="rounded-sm" />
              </div>
              <p className='font-light text-sm'>{video.artist}</p>
              <div className='flex'>
                <p className='font-light text-sm'>{video.releaseDate}</p>
                <p className="font-light text-sm before:content-['\2022'] before:px-1">{`${video.playersCount} players`}</p>
              </div>
            </div>
          </SwiperSlide>
        ))
      }
    </Swiper>
  )
}