import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { LyricSaveResult } from '#models/lyric-save-result'
import { LyricSaveProtocolService } from '#services/_protocols/lyric/lyric-save-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'

@inject()
export class LyricSaveService implements LyricSaveProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService,
    private readonly lyricRepository: LyricRepository
  ) {}

  async save(
    params: LyricSaveProtocolService.LyricParamsToInsert
  ): Promise<MethodResponse<LyricSaveResult>> {
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
