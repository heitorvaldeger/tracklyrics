import { VideoSaveResultModel } from '#models/video/video-save-result-model'

export const makeFakeVideoSaveResultModel = (): VideoSaveResultModel => ({
  artist: 'any_artist',
  genrerId: 0,
  isDraft: false,
  languageId: 0,
  linkYoutube: 'any_link',
  releaseYear: 'any_year',
  title: 'any_title',
  userId: 0,
  uuid: 'any_uuid',
  qtyViews: 0,
})
