import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import { FavoritePostgresRepository } from '#infra/db/repository/postgres/favorite-postgres-repository'
import FavoriteLucid from '#models/favorite-model/favorite-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { makeYoutubeUrl } from '#tests/factories/makeYoutubeUrl'
import { mockGenreEntity } from '#tests/factories/mocks/entities/mock-genre-entity'
import { mockLanguageEntity } from '#tests/factories/mocks/entities/mock-language-entity'
import { mockLucidEntity } from '#tests/factories/mocks/entities/mock-lucid-entity'
import { mockUserEntity } from '#tests/factories/mocks/entities/mock-user-entity'

const makeSut = async () => {
  const { fakeVideo, fakeGenre, fakeLanguage, fakeUser, fakeFavorite } = await mockLucidEntity()

  const sut = new FavoritePostgresRepository()

  return { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser, fakeFavorite }
}

test.group('FavoritePostgresRepository', () => {
  test('it must return true if video added to favorite on success', async ({ expect }) => {
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

    const { sut } = await makeSut()

    const added = await sut.addFavorite(fakeVideo.id, fakeUser.id, faker.string.uuid())
    expect(added).toBeTruthy()
  })

  test('it must return true if favorite already exists', async ({ expect }) => {
    const { sut, fakeVideo, fakeFavorite } = await makeSut()

    const added = await sut.addFavorite(fakeVideo.id, fakeVideo.userId, fakeFavorite.uuid)
    expect(added).toBeTruthy()
  })

  test('it must return true if video removed to favorite on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()

    const response = await sut.removeFavorite(fakeVideo.id, fakeVideo.userId)
    expect(response).toBeTruthy()
  })

  test('it must return a list favorite videos by user', async ({ expect }) => {
    const { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser } = await makeSut()
    const entity2 = await mockLucidEntity()
    const entity3 = await mockLucidEntity()
    const entity4 = await mockLucidEntity()

    await FavoriteLucid.create({
      videoId: entity2.fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })
    await FavoriteLucid.create({
      videoId: entity3.fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })
    await FavoriteLucid.create({
      videoId: entity4.fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })

    const response = await sut.findFavoritesByUser(fakeVideo.userId)
    expect(response.length).toBe(4)
    expect(response[0]).toEqual({
      title: fakeVideo.title,
      artist: fakeVideo.artist,
      uuid: fakeVideo.uuid,
      releaseYear: fakeVideo.releaseYear,
      linkYoutube: fakeVideo.linkYoutube,
      language: fakeLanguage.name,
      genre: fakeGenre.name,
      username: fakeUser.username,
    })
  })
})
