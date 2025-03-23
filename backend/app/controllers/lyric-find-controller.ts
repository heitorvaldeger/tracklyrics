import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { LyricFindProtocolService } from '#services/_protocols/lyric/lyric-find-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class LyricFindController {
  constructor(private readonly lyricFindService: LyricFindProtocolService) {}

  async find({ request, response }: HttpContext) {
    const [errors, data] = await uuidValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.lyricFindService.find(data.uuid)
  }
}
