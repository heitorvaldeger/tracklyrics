import { VideoFindModel } from '#models/video-model/video-find-model'

export const mockVideoModel = (): VideoFindModel => ({
  uuid: 'any_uuid',
  title: 'any_title',
  artist: 'any_artist',
  linkYoutube: 'any_link',
  releaseYear: 'any_year',
  language: 'any_language',
  genre: 'any_genre',
  username: 'any_username',
})
