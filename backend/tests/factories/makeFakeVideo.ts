import _ from 'lodash'
import { randomUUID } from 'node:crypto'
import Video from '#models/video'
import { IVideoResponse } from '#interfaces/IVideoResponse'
import Genrer from '#models/genrer'
import Language from '#models/language'

export const makeFakeVideo = async (
  genrer: Genrer,
  language: Language
): Promise<IVideoResponse> => {
  const uuid = randomUUID()

  const fakeVideo = (
    await Video.create({
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
  ).serialize({
    fields: {
      omit: ['languageId', 'genrerId'],
    },
  }) as IVideoResponse

  return {
    ...fakeVideo,
    genrer: genrer.name,
    language: language.name,
  }
}
