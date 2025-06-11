import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import _ from 'lodash'

import { ISaveVideoSchema } from '#core/domain/validators/SaveVideoSchema'
import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import { IVideoUpdateService } from '#services/interfaces/video-update-service'

@inject()
export default class UpdateVideoController {
  constructor(
    private readonly videoUpdateService: IVideoUpdateService,
    private readonly saveVideoValidator: ISaveVideoSchema,
    private readonly uuidValidator: IUUIDValidatorSchema
  ) {}

  async handle({ request }: HttpContext) {
    const { uuid } = await this.uuidValidator.validateAsync(request.params())
    const video = await this.saveVideoValidator.validateAsync(request.body())

    return await this.videoUpdateService.update(video, uuid)
  }
}
