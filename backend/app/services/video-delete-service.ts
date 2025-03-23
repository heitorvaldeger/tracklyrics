import { inject } from '@adonisjs/core'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoDeleteProtocolService } from '#services/_protocols/video/video-delete-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'

@inject()
export class VideoDeleteService implements VideoDeleteProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService
  ) {}

  async delete(uuid: string) {
    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(uuid)) {
      throw new VideoNotFoundException()
    }

    return await this.videoRepository.delete(uuid)
  }
}
