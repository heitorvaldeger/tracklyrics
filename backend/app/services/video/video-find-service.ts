import { VideoRepository } from '#repository/protocols/video-repository'
import { inject } from '@adonisjs/core'
import { VideoFindProtocolService } from './protocols/video-find-protocol-service.js'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoFindModel } from '#models/video-model/video-find-model'
import _ from 'lodash'

@inject()
export class VideoFindService implements VideoFindProtocolService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async find(uuid: string): Promise<IMethodResponse<VideoFindModel | null>> {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    return createSuccessResponse(video)
  }

  async findBy(
    filters: Partial<VideoRepository.FindVideoParams>
  ): Promise<IMethodResponse<VideoFindModel[]>> {
    const videos = await this.videoRepository.findBy(filters)
    return createSuccessResponse(videos)
  }
}
