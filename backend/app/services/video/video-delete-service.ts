import { inject } from '@adonisjs/core'

import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoCurrentUserProtocolService } from '#services/video/protocols/video-currentuser-protocol-service'
import { VideoDeleteProtocolService } from '#services/video/protocols/video-delete-protocol-service'

import { VideoRepository } from '../../infra/db/protocols/video-repository.js'

@inject()
export class VideoDeleteService implements VideoDeleteProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly videoCurrentUserService: VideoCurrentUserProtocolService
  ) {}

  async delete(uuid: string): Promise<IMethodResponse<boolean>> {
    if (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(uuid)) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    const isSuccess = await this.videoRepository.delete(uuid)
    return createSuccessResponse(isSuccess)
  }
}
