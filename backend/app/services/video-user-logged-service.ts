import { inject } from '@adonisjs/core'

import UnauthorizedException from '#exceptions/unauthorized-exception'
import { Auth } from '#infra/auth/protocols/auth'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class VideoUserLoggedService implements VideoUserLoggedProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: Auth
  ) {}

  async isNotVideoOwnedByUserLogged(videoUuid: string) {
    const userId = this.authStrategy.getUserId()
    const userIdFromVideo = await this.videoRepository.getUserId(videoUuid)

    return userIdFromVideo !== userId
  }

  async getVideosByUserLogged() {
    const userUuid = this.authStrategy.getUserUuid()
    if (!userUuid) {
      throw new UnauthorizedException()
    }

    const videos = await this.videoRepository.findBy({ userUuid })

    return videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
  }
}
