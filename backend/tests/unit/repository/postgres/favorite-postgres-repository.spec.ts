import { test } from '@japa/runner'
import Favorite from '#models/lucid-orm/favorite'
import { faker } from '@faker-js/faker'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { FavoritePostgresRepository } from '#repository/postgres-repository/favorite-postgres-repository'

const makeSut = async () => {
  const { fakeVideo, fakeGenre, fakeLanguage, fakeUser } = await mockVideoEntity()

  const sut = new FavoritePostgresRepository()

  return { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser }
}

test.group('FavoritePostgresRepository', () => {
  test('should return true if video added or updated to favorite on success', async ({
    expect,
  }) => {
    const { sut, fakeVideo } = await makeSut()

    const added = await sut.addFavorite(fakeVideo.id, fakeVideo.userId, faker.string.uuid())
    expect(added).toBeTruthy()
  })

  test('should return true if favorite already exists', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    const favoriteUuid = faker.string.uuid()
    await Favorite.create({
      videoId: fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: favoriteUuid,
    })

    const added = await sut.addFavorite(fakeVideo.id, fakeVideo.userId, favoriteUuid)
    expect(added).toBeTruthy()
  })

  test('should return true if video removed to favorite on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()

    await Favorite.create({
      videoId: fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })

    const response = await sut.removeFavorite(fakeVideo.id, fakeVideo.userId)
    expect(response).toBeTruthy()
  })

  test('should return a list favorite videos by user', async ({ expect }) => {
    const { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser } = await makeSut()
    const [entity2, entity3, entity4] = await Promise.all([
      mockVideoEntity(),
      mockVideoEntity(),
      mockVideoEntity(),
    ])

    await Favorite.create({
      videoId: fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })
    const entities = [entity2, entity3, entity4]
    entities.forEach(async (entity) => {
      await Favorite.create({
        videoId: entity.fakeVideo.id,
        userId: fakeVideo.userId,
        uuid: faker.string.uuid(),
      })
    })

    const response = await sut.findFavoritesByUser(fakeVideo.userId)
    expect(response.length).toBe(4)
    expect(response[0]).toEqual({
      title: fakeVideo.title,
      artist: fakeVideo.artist,
      uuid: fakeVideo.uuid,
      releaseYear: fakeVideo.releaseYear,
      linkYoutube: fakeVideo.linkYoutube,
      qtyViews: fakeVideo.qtyViews,
      language: fakeLanguage.name,
      genre: fakeGenre.name,
      username: fakeUser.username,
    })
  })
})
