import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import _ from 'lodash'

import { Favorite } from '#models/favorite-bkp'
import { Genre } from '#models/genre'
import { Language } from '#models/language'
import { Lyric } from '#models/lyric'
import { User } from '#models/user-model/user-lucid'
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
  fakeUser: User
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
  fakeUser: User
}) => {
  return (
    await Video.create({
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
  ).serialize() as Video
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

  const fakeLyrics = (
    await Lyric.createMany([
      {
        videoId: fakeVideo.id,
        seq: 1,
        startTime: '00:00.00',
        endTime: '00:00.10',
        line: faker.lorem.sentence(5),
      },
      {
        videoId: fakeVideo.id,
        seq: 2,
        startTime: '00:00.11',
        endTime: '00:00.14',
        line: faker.lorem.sentence(5),
      },
    ])
  ).map((lyric) => lyric.serialize() as Lyric)

  return {
    fakeLanguage,
    fakeGenre,
    fakeUser,
    fakeVideo,
    fakeFavorite,
    fakeLyrics,
  }
}
