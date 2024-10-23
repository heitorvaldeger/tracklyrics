import { randomUUID } from 'node:crypto'
import Video from '#models/video'
import { makeFakeLanguage } from './makeFakeLanguage.js'
import { makeFakeGenrer } from './makeFakeGenrer.js'

export const makeFakeVideo = async () => {
  const language = await makeFakeLanguage()
  const genrer = await makeFakeGenrer()
  const uuid = randomUUID()
  const fakeVideo: Partial<Video> = {
    isDraft: false,
    title: 'any_title',
    artist: 'any_artist',
    qtyViews: BigInt(0),
    releaseYear: '2000',
    linkYoutube: 'any_link',
    uuid: uuid,
    languageId: BigInt(language.id),
    genrerId: BigInt(genrer.id),
  }
  await Video.create(fakeVideo)
  return { fakeVideo, language, genrer }
}
