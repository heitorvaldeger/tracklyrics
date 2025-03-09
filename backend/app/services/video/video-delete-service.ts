import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoDeleteProtocolService } from '#services/_protocols/video/video-delete-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'

@inject()
export class VideoDeleteService implements VideoDeleteProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService
  ) {}

  async delete(uuid: string): Promise<MethodResponse<boolean>> {
    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(uuid)) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const isSuccess = await this.videoRepository.delete(uuid)
    return createSuccessResponse(isSuccess)
  }
}
