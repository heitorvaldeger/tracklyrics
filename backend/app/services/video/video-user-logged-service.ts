import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { getYoutubeThumbnail } from '#helpers/get-youtube-thumbnail'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import { VideoUserLoggedProtocolService } from '#services/protocols/video/video-user-logged-protocol-service'

@inject()
export class VideoUserLoggedService implements VideoUserLoggedProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: AuthStrategy
  ) {}

  async isNotVideoOwnedByUserLogged(videoUuid: string): Promise<boolean> {
    const userId = this.authStrategy.getUserId()
    const userIdFromVideo = await this.videoRepository.getUserId(videoUuid)

    return userIdFromVideo !== userId
  }

  async getVideosByUserLogged(): Promise<MethodResponse<VideoFindModel[]>> {
    const userUuid = this.authStrategy.getUserUuid()
    if (!userUuid) {
      return createFailureResponse(APPLICATION_MESSAGES.UNAUTHORIZED)
    }

    const videos = await this.videoRepository.findBy({ userUuid })

    const videosWithThumbnail = videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))

    return createSuccessResponse(videosWithThumbnail)
  }
}
