import { inject } from '@adonisjs/core'
import _ from 'lodash'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { VideoListFindModel } from '#models/video-model/video-list-find-model'
import { VideoFindProtocolService } from '#services/protocols/video/video-find-protocol-service'

@inject()
export class VideoFindService implements VideoFindProtocolService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async find(uuid: string): Promise<MethodResponse<VideoListFindModel | null>> {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    return createSuccessResponse(video)
  }

  async findBy(
    filters: Partial<VideoRepository.FindVideoParams>
  ): Promise<MethodResponse<VideoListFindModel[]>> {
    const videos = await this.videoRepository.findBy(filters)
    return createSuccessResponse(videos)
  }
}
