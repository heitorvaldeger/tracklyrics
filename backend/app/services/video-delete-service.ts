import { inject } from '@adonisjs/core'

import { IVideoRepository } from '#core/infra/db/repository/interfaces/video-repository'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { IVideoDeleteService } from '#services/interfaces/video-delete-service'
import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'

@inject()
export class VideoDeleteService implements IVideoDeleteService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly videoCurrentUserService: IVideoUserLoggedService
  ) {}

  async delete(uuid: string) {
    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(uuid)) {
      throw new VideoNotFoundException()
    }

    return await this.videoRepository.delete(uuid)
  }
}
