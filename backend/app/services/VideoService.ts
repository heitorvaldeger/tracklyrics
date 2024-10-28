import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { IVideoService } from './interfaces/IVideoService.js'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/interfaces/IMethodResponse'
import { IVideoCreateRequest } from '#interfaces/IVideoCreateRequest'
import { randomUUID } from 'node:crypto'

@inject()
export class VideoService implements IVideoService {
  constructor(private readonly videoRepository: IVideoRepository) {}

  async findAll(): Promise<IMethodResponse<IVideoResponse[]>> {
    const videos = await this.videoRepository.findAll()
    return createSuccessResponse(this.mapperVideos(videos))
  }

  async find(uuid: string): Promise<IMethodResponse<IVideoResponse | null>> {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    video.qtyViews = BigInt(video.qtyViews)
    return createSuccessResponse(video)
  }

  async findByGenrer(genrerId: number): Promise<IMethodResponse<IVideoResponse[]>> {
    const videos = await this.videoRepository.findByGenrer(genrerId)
    return createSuccessResponse(this.mapperVideos(videos))
  }

  async findByLanguage(languageId: number): Promise<IMethodResponse<IVideoResponse[]>> {
    const videos = await this.videoRepository.findByLanguage(languageId)
    return createSuccessResponse(this.mapperVideos(videos))
  }

  async delete(uuid: string): Promise<IMethodResponse<any>> {
    if (!(await this.videoRepository.isVideoAvailable(uuid))) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    await this.videoRepository.delete(uuid)
    return createSuccessResponse()
  }

  async create(payload: IVideoCreateRequest): Promise<IMethodResponse<any>> {
    const uuid = randomUUID()
    await this.videoRepository.create({
      ...payload,
      uuid,
    })

    return createSuccessResponse()
  }

  async update(payload: IVideoCreateRequest, uuid: string): Promise<IMethodResponse<any>> {
    await this.videoRepository.update(payload, uuid)

    return createSuccessResponse()
  }

  private mapperVideos(videos: IVideoResponse[]) {
    return videos.map((video) => ({
      ...video,
      qtyViews: BigInt(video.qtyViews),
    }))
  }
}
