import { VideoFindModel } from '#models/video-model/video-find-model'

export const mockFakeVideoModel = (): VideoFindModel => ({
  uuid: 'any_uuid',
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  linkYoutube: 'any_link',
  qtyViews: 0,
  releaseYear: 'any_year',
  language: 'any_language',
  genre: 'any_genre',
  username: 'any_username',
})
