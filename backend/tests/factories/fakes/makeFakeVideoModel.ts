import { VideoFindModel } from '#models/video/video-find-model'

export const makeFakeVideoModel = (): VideoFindModel => ({
  uuid: 'any_uuid',
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  linkYoutube: 'any_link',
  qtyViews: 0,
  releaseYear: 'any_year',
  language: 'any_language',
  genrer: 'any_genrer',
  username: 'any_username',
})
