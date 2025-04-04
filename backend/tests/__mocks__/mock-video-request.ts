import { faker } from '@faker-js/faker'

import { VideoSave } from '#infra/db/repository/interfaces/video-repository'
import { IVideoCreateService } from '#services/interfaces/video-create-service'
import { makeYoutubeUrl } from '#tests/__utils__/makeYoutubeUrl'

export const mockVideoCreateOrUpdateRequest: IVideoCreateService.Params = {
  isDraft: false,
  title: faker.lorem.words(2),
  artist: faker.lorem.words(2),
  releaseYear: faker.string.numeric({ length: 4 }),
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genreId: 0,
  lyrics: [
    {
      startTime: '00:00.00',
      endTime: '00:00.10',
      line: faker.lorem.sentence(5),
    },
    {
      startTime: '00:00.11',
      endTime: '00:00.16',
      line: faker.lorem.sentence(5),
    },
    {
      startTime: '00:00.18',
      endTime: '00:00.23',
      line: faker.lorem.sentence(5),
    },
  ],
}

export const mockVideoCreateOrUpdateResponse: VideoSave = {
  isDraft: false,
  title: faker.lorem.words(2),
  artist: faker.lorem.words(2),
  releaseYear: faker.string.numeric({ length: 4 }),
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genreId: 0,
  uuid: faker.string.uuid(),
  userId: 0,
}
