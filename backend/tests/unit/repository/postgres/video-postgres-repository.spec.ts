import { test } from '@japa/runner'
import { VideoPostgresRepository } from '#repository/postgres/VideoPostgresRepository'
import Video from '#models/video'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { makeFakeLanguage } from '#tests/factories/makeFakeLanguage'
import { makeFakeGenrer } from '#tests/factories/makeFakeGenrer'
import { randomUUID } from 'node:crypto'

const makeSut = async () => {
  const fakeLanguage = await makeFakeLanguage()
  const fakeGenrer = await makeFakeGenrer()
  const fakeVideo = await makeFakeVideo(fakeGenrer, fakeLanguage)

  const sut = new VideoPostgresRepository()

  return { sut, fakeVideo, fakeGenrer, fakeLanguage }
}

test.group('VideoPostgresRepository', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
  })
  test('should returns a list of videos on findAll', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()

    const videos = await sut.findAll()

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos).toEqual([fakeVideo])
  })

  test('should return a video on find', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()

    const video = await sut.find(fakeVideo.uuid)

    expect(video).toEqual(fakeVideo)
  })

  test('should returns a list videos returns on findByGenrer', async ({ expect }) => {
    const { sut, fakeVideo, fakeGenrer } = await makeSut()
    const videos = await sut.findByGenrer(fakeGenrer.id)

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos).toEqual([fakeVideo])
  })

  test('should returns a list videos returns on findByLanguage', async ({ expect }) => {
    const { sut, fakeLanguage, fakeVideo } = await makeSut()
    const videos = await sut.findByLanguage(fakeLanguage.id)

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos).toEqual([fakeVideo])
  })

  test('should return success if a video was delete on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    const noReturn = await sut.delete(fakeVideo.uuid)

    expect(noReturn).toBeFalsy()
  })

  test('should return success if a video was update on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    const fakeVideoPayload = {
      title: 'any_title',
    }
    const noReturn = await sut.update(fakeVideoPayload, fakeVideo.uuid)

    expect(noReturn).toBeFalsy()
  })

  test('should return success if a video was create on success', async ({ expect }) => {
    const { sut, fakeGenrer, fakeLanguage } = await makeSut()
    const fakeVideoPayload = {
      uuid: randomUUID(),
      isDraft: false,
      title: 'any_title',
      artist: 'any_artist',
      linkYoutube: 'any_link',
      qtyViews: BigInt(0),
      releaseYear: '0000',
      languageId: BigInt(fakeLanguage.id),
      genrerId: BigInt(fakeGenrer.id),
    }
    const noReturn = await sut.create(fakeVideoPayload)

    expect(noReturn).toBeFalsy()
  })
})
