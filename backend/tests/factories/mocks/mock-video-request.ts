import { faker } from '@faker-js/faker'

import { VideoCreateProtocolService } from '#services/protocols/video/video-create-protocol-service'
import { makeYoutubeUrl } from '#tests/factories/makeYoutubeUrl'

export const mockVideoRequest = (): VideoCreateProtocolService.Params => ({
  isDraft: false,
  title: faker.lorem.words(2),
  artist: faker.lorem.words(2),
  releaseYear: faker.string.numeric({ length: 4 }),
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genreId: 0,
})
