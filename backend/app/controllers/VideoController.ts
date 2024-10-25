import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import Video from '#models/video'
import { badRequest, noContent, notFound, ok, serverError } from '#helpers/http'
import { createVideoValidator, uuidVideoValidator } from '#validators/VideoValidator'
import { randomUUID } from 'node:crypto'
import { IVideoCreateRequest } from '#interfaces/IVideoCreateRequest'
import { IVideoService } from '#services/interfaces/IVideoService'
import { inject } from '@adonisjs/core'

@inject()
export default class VideoController {
  constructor(private videoService: IVideoService) {}

  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const video = await this.videoService.find(uuid)

      if (!video) {
        return notFound()
      }

      video.qtyViews = BigInt(video.qtyViews)
      return ok(video)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      serverError(error)
    }
  }

  async findAll() {
    const videos = await this.videoService.findAll()

    return ok(
      videos.map((video) => ({
        ...video,
        qtyViews: BigInt(video.qtyViews),
      }))
    )
  }

  async create({ request }: HttpContext) {
    try {
      const requestBody = request.body() as IVideoCreateRequest
      const payload = await createVideoValidator.validate(requestBody)
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
      const { uuid } = await uuidVideoValidator.validate(request.params())

      const video = await Video.findBy('uuid', uuid)
      if (!video) {
        return notFound()
      }
      await Video.query().where('uuid', uuid).delete()

      return noContent()
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
