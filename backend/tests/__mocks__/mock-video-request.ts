import { faker } from '@faker-js/faker'

import { VideoSaveResult } from '#models/video-save'
import { VideoCreateProtocolService } from '#services/_protocols/video/video-create-protocol-service'
import { makeYoutubeUrl } from '#tests/__utils__/makeYoutubeUrl'

export const mockVideoCreateOrUpdateRequest = (): VideoCreateProtocolService.Params => ({
  isDraft: false,
  title: faker.lorem.words(2),
  artist: faker.lorem.words(2),
  releaseYear: faker.string.numeric({ length: 4 }),
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genreId: 0,
})

export const mockVideoCreateOrUpdateResponse = (): VideoSaveResult => ({
  isDraft: false,
  title: faker.lorem.words(2),
  artist: faker.lorem.words(2),
  releaseYear: faker.string.numeric({ length: 4 }),
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genreId: 0,
  uuid: faker.string.uuid(),
  userId: 0,
})
