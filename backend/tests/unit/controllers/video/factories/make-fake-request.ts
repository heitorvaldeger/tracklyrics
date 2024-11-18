import { VideoRequestParams } from '../../../../../app/params/video/video-request-params.js'
import { makeYoutubeUrl } from '#tests/factories/makeYoutubeUrl'

export const makeFakeRequest = (): VideoRequestParams => ({
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  releaseYear: '0000',
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genrerId: 0,
})
