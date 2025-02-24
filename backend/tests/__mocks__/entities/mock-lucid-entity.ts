import { faker } from '@faker-js/faker'

import FavoriteLucid from '#models/favorite-model/favorite-lucid'
import GenreLucid from '#models/genre-model/genre-lucid'
import { LanguageLucid } from '#models/language-model/language-lucid'
import { LyricLucid } from '#models/lyric-model/lyric-lucid'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockGenreEntity } from '#tests/__mocks__/entities/mock-genre-entity'
import { mockLanguageEntity } from '#tests/__mocks__/entities/mock-language-entity'
import { mockUserEntity } from '#tests/__mocks__/entities/mock-user-entity'
import { makeYoutubeUrl } from '#tests/__utils__/makeYoutubeUrl'

type MockLucidEntity = {
  fakeLanguage: LanguageLucid
  fakeGenre: GenreLucid
  fakeUser: UserLucid
  fakeVideo: VideoLucid
  fakeFavorite: FavoriteLucid
  fakeLyrics: LyricLucid[]
}

export const mockLucidEntity = async (): Promise<MockLucidEntity> => {
  const fakeLanguage = await mockLanguageEntity()
  const fakeGenre = await mockGenreEntity()
  const fakeUser = await mockUserEntity()

  const fakeVideo = await VideoLucid.create({
    isDraft: false,
    title: faker.lorem.words(2),
    artist: faker.lorem.words(2),
    releaseYear: faker.string.numeric({ length: 4 }),
    linkYoutube: makeYoutubeUrl(),
    uuid: faker.string.uuid(),
    languageId: fakeLanguage.id,
    genreId: fakeGenre.id,
    userId: fakeUser.id,
  })

  const fakeFavorite = await FavoriteLucid.create({
    videoId: fakeVideo.id,
    userId: fakeUser.id,
    uuid: faker.string.uuid(),
  })

  const fakeLyrics = await LyricLucid.createMany([
    {
      videoId: fakeVideo.id,
      seq: 1,
      startTime: '00:00:00',
      endTime: '00:00:10',
      line: faker.lorem.sentence(5),
    },
    {
      videoId: fakeVideo.id,
      seq: 2,
      startTime: '00:00:11',
      endTime: '00:00:14',
      line: faker.lorem.sentence(5),
    },
  ])

  return {
    fakeLanguage,
    fakeGenre,
    fakeUser,
    fakeVideo,
    fakeFavorite,
    fakeLyrics,
  }
}
