import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import _ from 'lodash'

import { Favorite } from '#models/favorite'
import { Genre } from '#models/genre'
import { Language } from '#models/language'
import { Lyric } from '#models/lyric'
import UserLucid from '#models/user-model/user-lucid'
import { Video } from '#models/video'
import { mockGenre } from '#tests/__mocks__/db/mock-genre'
import { mockLanguage } from '#tests/__mocks__/db/mock-language'
import { mockUser } from '#tests/__mocks__/db/mock-user'
import { makeYoutubeUrl } from '#tests/__utils__/makeYoutubeUrl'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

type MockAllTables = {
  fakeLanguage: Language
  fakeGenre: Genre
  fakeUser: UserLucid
  fakeVideo: Video
  fakeFavorite: Favorite
  fakeLyrics: Lyric[]
}

export const mockVideo = async ({
  fakeLanguage,
  fakeGenre,
  fakeUser,
}: {
  fakeLanguage: Language
  fakeGenre: Genre
  fakeUser: UserLucid
}) => {
  const video = toSnakeCase({
    isDraft: false,
    title: faker.lorem.words(2),
    artist: faker.lorem.words(2),
    releaseYear: faker.string.numeric({ length: 4 }),
    linkYoutube: makeYoutubeUrl(),
    uuid: faker.string.uuid(),
    languageId: fakeLanguage.id,
    genreId: fakeGenre.id,
    userId: fakeUser.id,
    createdAt: new Date().toISOString(),
  })
  return _.omit(
    toCamelCase<Video>((await db.table('videos').insert(video).returning(['*']))[0]),
    'createdAt',
    'updatedAt'
  )
}

export const mockAllTables = async (): Promise<MockAllTables> => {
  const fakeLanguage = await mockLanguage()
  const fakeGenre = await mockGenre()
  const fakeUser = await mockUser()

  const fakeVideo = await mockVideo({ fakeGenre, fakeLanguage, fakeUser })

  const fakeFavorite = toCamelCase<Favorite>(
    (
      await db
        .table('favorites')
        .insert(
          toSnakeCase({
            videoId: fakeVideo.id,
            userId: fakeUser.id,
            uuid: faker.string.uuid(),
            createdAt: new Date().toISOString(),
          })
        )
        .returning(['user_id', 'video_id', 'uuid'])
    )[0]
  )

  const lyrics = [
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
  ].map(toSnakeCase)

  const fakeLyrics = (await db.table('lyrics').insert(lyrics).returning(['*'])).map(
    toCamelCase
  ) as Lyric[]

  return {
    fakeLanguage,
    fakeGenre,
    fakeUser,
    fakeVideo,
    fakeFavorite,
    fakeLyrics,
  }
}
