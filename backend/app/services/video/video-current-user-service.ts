import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { IAuthService } from '#services/interfaces/IAuthService'
import { IVideoCurrentUserService } from '#services/video/interfaces/IVideoCurrentUserService'

@inject()
export class VideoCurrentUserService implements IVideoCurrentUserService {
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
