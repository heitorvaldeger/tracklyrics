import { makeYoutubeUrl } from '#tests/factories/makeYoutubeUrl'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'
import { faker } from '@faker-js/faker'

export const mockVideoRequest = (): VideoCreateProtocolService.Params => ({
  isDraft: false,
  title: faker.lorem.words(2),
  artist: faker.lorem.words(2),
  releaseYear: faker.string.numeric({ length: 4 }),
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genreId: 0,
})
