import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoService } from '#services/interfaces/IVideoService'
import _ from 'lodash'
import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/interfaces/IMethodResponse'
import { IVideoCreateRequest } from '#interfaces/IVideoCreateRequest'

export const makeFakeVideoServiceStub = () => {
  class VideoServiceStub implements IVideoService {
    find(uuid: string): Promise<IMethodResponse<IVideoResponse | null>> {
      return new Promise<IMethodResponse<IVideoResponse | null>>((resolve) =>
        resolve(
          createSuccessResponse({
            uuid: 'any_uuid',
            isDraft: false,
            title: 'any_title',
            artist: 'any_artist',
            linkYoutube: 'any_link',
            qtyViews: BigInt(0),
            releaseYear: 'any_year',
            language: 'any_language',
            genrer: 'any_genrer',
          })
        )
      )
    }

    findAll(): Promise<IMethodResponse<IVideoResponse[]>> {
      return new Promise<IMethodResponse<IVideoResponse[]>>((resolve) =>
        resolve(createSuccessResponse([]))
      )
    }

    findByGenrer(genrerId: number): Promise<IMethodResponse<IVideoResponse[]>> {
      return new Promise<IMethodResponse<IVideoResponse[]>>((resolve) =>
        resolve(createSuccessResponse([]))
      )
    }

    findByLanguage(languageId: number): Promise<IMethodResponse<IVideoResponse[]>> {
      return new Promise<IMethodResponse<IVideoResponse[]>>((resolve) =>
        resolve(createSuccessResponse([]))
      )
    }

    delete(uuid: string): Promise<IMethodResponse<any>> {
      return new Promise((resolve) => resolve(createSuccessResponse()))
    }

    create(payload: IVideoCreateRequest): Promise<IMethodResponse<any>> {
      return new Promise((resolve) => resolve(createSuccessResponse()))
    }

    update(payload: IVideoCreateRequest, uuid: string): Promise<IMethodResponse<any>> {
      return new Promise((resolve) => resolve(createSuccessResponse()))
    }
  }

  return new VideoServiceStub()
}
