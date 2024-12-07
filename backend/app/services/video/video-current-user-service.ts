import { inject } from '@adonisjs/core'

import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import { VideoCurrentUserProtocolService } from '#services/protocols/video/video-currentuser-protocol-service'

@inject()
export class VideoCurrentUserService implements VideoCurrentUserProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: AuthStrategy
  ) {}

  async isNotVideoOwnedByCurrentUser(videoUuid: string): Promise<boolean> {
    const userId = this.authStrategy.getUserId()
    const userIdFromVideo = await this.videoRepository.getUserId(videoUuid)

    return userIdFromVideo !== userId
  }
}
