import { VideoFindModel } from '#models/video-model/video-find-model'

export const mockVideoModel = (): VideoFindModel & {
  thumbnail: string
} => {
  return {
    uuid: 'any_uuid',
    title: 'any_title',
    artist: 'any_artist',
    linkYoutube: 'https://www.youtube.com/watch?v=93b9XX0GMGK',
    thumbnail: 'https://img.youtube.com/vi/93b9XX0GMGK/maxresdefault.jpg',
    releaseYear: 'any_year',
    language: 'any_language',
    genre: 'any_genre',
    username: 'any_username',
  }
}
