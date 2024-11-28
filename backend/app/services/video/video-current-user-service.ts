import { VideoRepository } from '#repository/protocols/video-repository'
import { inject } from '@adonisjs/core'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { VideoCurrentUserProtocolService } from '#services/video/protocols/video-currentuser-protocol-service'

@inject()
export class VideoCurrentUserService implements VideoCurrentUserProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authService: AuthProtocolService
  ) {}

  async isNotVideoOwnedByCurrentUser(videoUuid: string): Promise<boolean> {
    const userId = this.authService.getUserId()
    const userIdFromVideo = await this.videoRepository.getUserId(videoUuid)

    return userIdFromVideo !== userId
  }
}
