import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import _ from 'lodash'

import { IVideoUpdateService } from '#services/interfaces/video-update-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'
import { createOrUpdateVideoValidator } from '#validators/vinejs/video-validator'

@inject()
export default class VideoUpdateController {
  constructor(private readonly videoUpdateService: IVideoUpdateService) {}

  async update({ request, response }: HttpContext) {
    const [errorsUuid, uuid] = await uuidValidator.tryValidate(request.params())
    const [errorsVideo, video] = await createOrUpdateVideoValidator.tryValidate(request.body())

    if (errorsUuid || errorsVideo) {
      const messages = _.concat(_.compact(errorsVideo?.messages), _.compact(errorsUuid?.messages))
      return response.badRequest(messages)
    }

    return await this.videoUpdateService.update(video, uuid.uuid)
  }
}
