import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import Video from '#models/video'
import { badRequest, noContent, notFound, ok, serverError } from '#helpers/http'
import { createVideoValidator } from '#validators/VideoValidator'
import { randomUUID } from 'node:crypto'
import db from '@adonisjs/lucid/services/db'
import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoCreateRequest } from '#interfaces/IVideoCreateRequest'

export default class VideoController {
  async find({ request }: HttpContext) {
    try {
      const { uuid } = request.params()
      const video: IVideoResponse | null = await db
        .from('videos')
        .where('uuid', uuid)
        .innerJoin('languages', 'languages.id', 'language_id')
        .select(
          'title',
          'artist',
          'uuid',
          'release_year as releaseYear',
          'link_youtube as linkYoutube',
          'qty_views as qtyViews',
          'is_draft as isDraft',
          'languages.name as language'
        )
        .first()

      if (!video) {
        return notFound()
      }
      video.qtyViews = BigInt(video.qtyViews)
      return ok(video)
    } catch (error) {
      serverError(error)
    }
  }

  async findAll() {
    const videos: IVideoResponse[] = await db
      .from('videos')
      .innerJoin('languages', 'languages.id', 'language_id')
      .select(
        'title',
        'artist',
        'uuid',
        'release_year as releaseYear',
        'link_youtube as linkYoutube',
        'qty_views as qtyViews',
        'is_draft as isDraft',
        'languages.name as language'
      )

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
      const { uuid } = request.params()

      const video = await Video.findBy('uuid', uuid)
      if (!video) {
        return notFound()
      }
      await Video.query().where('uuid', uuid).delete()

      return noContent()
    } catch (error) {
      return null
    }
  }
}
