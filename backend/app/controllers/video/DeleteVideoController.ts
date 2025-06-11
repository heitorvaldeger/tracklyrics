import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import { IVideoDeleteService } from '#services/interfaces/video-delete-service'

@inject()
export default class DeleteVideoController {
  constructor(
    private readonly videoDeleteService: IVideoDeleteService,
    private readonly uuidValidator: IUUIDValidatorSchema
  ) {}

  async handle({ request }: HttpContext) {
    const { uuid } = await this.uuidValidator.validateAsync(request.params())
    return await this.videoDeleteService.delete(uuid)
  }
}
