import { randomUUID } from 'node:crypto'
import Video from '#models/video'
import { makeFakeLanguage } from './makeFakeLanguage.js'

export const makeFakeVideo = async () => {
  const language = await makeFakeLanguage()
  const uuid = randomUUID()
  const fakeVideo = {
    isDraft: false,
    title: 'any_title',
    artist: 'any_artist',
    qtyViews: BigInt(0),
    releaseYear: '2000',
    linkYoutube: 'any_link',
    uuid: uuid,
    languageId: BigInt(language.id),
  }
  await Video.create(fakeVideo)
  return fakeVideo
}
