import _ from 'lodash'
import { randomUUID } from 'node:crypto'
import Video from '#models/video'
import { makeFakeLanguage } from './makeFakeLanguage.js'
import { makeFakeGenrer } from './makeFakeGenrer.js'

export interface FakeVideoFactory {
  isDraft: boolean
  title: string
  artist: string
  qtyViews: bigint
  releaseYear: string
  linkYoutube: string
  uuid: string
  language: string
  genrer: string
}

export const makeFakeVideo = async (): Promise<FakeVideoFactory> => {
  const language = await makeFakeLanguage()
  const genrer = await makeFakeGenrer()
  const uuid = randomUUID()

  const fakeVideo = new Video()
  fakeVideo.fill({
    isDraft: false,
    title: 'any_title',
    artist: 'any_artist',
    qtyViews: BigInt(0),
    releaseYear: '2000',
    linkYoutube: 'any_link',
    uuid: uuid,
    languageId: BigInt(language.id),
    genrerId: BigInt(genrer.id),
  })
  await Video.create(fakeVideo)

  return {
    ..._.omit(fakeVideo, 'languageId', 'genrerId'),
    language: language.name,
    genrer: genrer.name,
  }
}
