import { inject } from '@adonisjs/core'
import _ from 'lodash'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoMetadata } from '#models/video-metadata'
import { VideoFindProtocolService } from '#services/_protocols/video/video-find-protocol-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class VideoFindService implements VideoFindProtocolService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async find(uuid: string): Promise<MethodResponse<VideoMetadata | null>> {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const videoWithThumbnail = {
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }

    return createSuccessResponse(videoWithThumbnail)
  }

  async findBy(
    filters: Partial<VideoRepository.FindVideoParams>
  ): Promise<MethodResponse<VideoMetadata[]>> {
    const videos = await this.videoRepository.findBy(filters)

    const videosWithThumbnail = videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
    return createSuccessResponse(videosWithThumbnail)
  }
}
