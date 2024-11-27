import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { IVideoDeleteService } from '#services/video/interfaces/IVideoDeleteService'
import { IVideoOwnedByCurrentUser } from '#services/video/interfaces/IVideoOwnedByCurrentUser'

@inject()
export class VideoDeleteService implements IVideoDeleteService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly videoIsNotVideoOwnedByCurrentUser: IVideoOwnedByCurrentUser
  ) {}

  async delete(uuid: string): Promise<IMethodResponse<boolean>> {
    if (await this.videoIsNotVideoOwnedByCurrentUser.isNotVideoOwnedByCurrentUser(uuid)) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    const isSuccess = await this.videoRepository.delete(uuid)
    return createSuccessResponse(isSuccess)
  }
}
