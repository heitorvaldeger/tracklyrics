import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import _ from 'lodash'

import { LyricSaveProtocolService } from '#services/_protocols/lyric/lyric-save-protocol-service'
import { lyricSaveValidator } from '#validators/vinejs/lyric-save-validator'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class LyricSaveController {
  constructor(private readonly lyricSaveService: LyricSaveProtocolService) {}

  async save({ request, response }: HttpContext) {
    const [errorsUuid, uuid] = await uuidValidator.tryValidate(request.params())
    const [errorsLyrics, lyrics] = await lyricSaveValidator.tryValidate(request.body())

    if (errorsUuid) {
      return response.badRequest(errorsUuid?.messages)
    }

    if (errorsLyrics) {
      return response.badRequest(errorsLyrics?.messages)
    }

    return await this.lyricSaveService.save({
      videoUuid: uuid.uuid,
      lyrics,
    })
  }
}
