import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { LyricRepository } from '#infra/db/repository/protocols/lyric-repository'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { LyricSaveResponse } from '#models/lyric-model/lyric-save-response'
import { LyricSaveProtocolService } from '#services/protocols/lyric/lyric-save-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/protocols/video/video-user-logged-protocol-service'

@inject()
export class LyricSaveService implements LyricSaveProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService,
    private readonly lyricRepository: LyricRepository
  ) {}

  async save(
    params: LyricSaveProtocolService.LyricParamsToInsert
  ): Promise<MethodResponse<LyricSaveResponse>> {
    const { videoUuid, lyrics } = params
    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(videoUuid)) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const newLyricsToInsert = lyrics.map((lyric, idx) => ({
      seq: ++idx,
      videoId,
      ...lyric,
    }))

    const newLyricsInserted = await this.lyricRepository.save(newLyricsToInsert)
    return createSuccessResponse(newLyricsInserted)
  }
}
