import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import Video from '#models/video'
import { badRequest, noContent, ok, serverError } from '#helpers/http'
import { createVideoValidator } from '#validators/VideoValidator'
import { randomUUID } from 'node:crypto'

export default class VideoController {
  async findAll() {
    const videos = await Video.all()

    return ok(videos.map((video) => video.serialize()))
  }

  async create({ request }: HttpContext) {
    try {
      const payload = await createVideoValidator.validate(request.all())
      const uuid = randomUUID()
      await Video.create({
        ...payload,
        uuid,
      })

      return noContent()
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }

      return serverError(error as Error)
    }
  }

  async delete({ request }: HttpContext) {
    try {
      const { uuid } = request.params()

      await Video.query().where('uuid', uuid).delete()

      return noContent()
    } catch (error) {
      return null
    }
  }
}
