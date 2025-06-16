import { inject } from '@adonisjs/core'

import { Auth } from '#core/infra/auth/interfaces/auth'
import { IVideoRepository } from '#core/infra/db/repository/interfaces/video-repository'
import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class VideoUserLoggedService implements IVideoUserLoggedService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly auth: Auth
  ) {}

  async isNotVideoOwnedByUserLogged(videoUuid: string) {
    const userId = this.auth.getUserId()
    const userIdFromVideo = await this.videoRepository.getUserId(videoUuid)

    return userIdFromVideo !== userId
  }

  async getVideosByUserLogged() {
    const userUuid = this.auth.getUserUuid()!

    const videos = await this.videoRepository.findBy({ userUuid })

    return videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
  }
}
