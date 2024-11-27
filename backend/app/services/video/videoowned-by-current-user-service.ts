import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { IAuthService } from '#services/interfaces/IAuthService'
import { IVideoOwnedByCurrentUser } from '#services/video/interfaces/IVideoOwnedByCurrentUser'

@inject()
export class VideoOwnedByCurrentUserService implements IVideoOwnedByCurrentUser {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly authService: IAuthService
  ) {}

  async isNotVideoOwnedByCurrentUser(videoUuid: string): Promise<boolean> {
    const userId = this.authService.getUserId()
    const userIdFromVideo = await this.videoRepository.getUserId(videoUuid)

    return userIdFromVideo !== userId
  }
}
