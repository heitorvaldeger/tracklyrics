import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'

export const mockFakeVideoSaveResultModel = (): VideoSaveResultModel => ({
  artist: 'any_artist',
  genreId: 0,
  isDraft: false,
  languageId: 0,
  linkYoutube: 'any_link',
  releaseYear: 'any_year',
  title: 'any_title',
  userId: 0,
  uuid: 'any_uuid',
  qtyViews: 0,
})
