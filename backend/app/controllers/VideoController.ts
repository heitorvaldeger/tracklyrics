import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import Video from '#models/video'
import { badRequest, noContent, notFound, ok, serverError } from '#helpers/http'
import { createVideoValidator } from '#validators/VideoValidator'
import { randomUUID } from 'node:crypto'
import db from '@adonisjs/lucid/services/db'

export default class VideoController {
  async find({ request }: HttpContext) {
    try {
      const { uuid } = request.params()
      const video: Video = await db
        .from('videos')
        .where('uuid', uuid)
        .select(
          'title',
          'artist',
          'uuid',
          'release_year as releaseYear',
          'link_youtube as linkYoutube',
          'qty_views as qtyViews',
          'is_draft as isDraft',
          'language_id as languageId'
        )
        .first()

      if (!video) {
        return notFound()
      }
      video.qtyViews = BigInt(video.qtyViews)
      video.languageId = BigInt(video.languageId)
      return ok(video)
    } catch (error) {
      serverError(error)
    }
  }

  async findAll() {
    const videos: Video[] = await db
      .from('videos')
      .select(
        'title',
        'artist',
        'uuid',
        'release_year as releaseYear',
        'link_youtube as linkYoutube',
        'qty_views as qtyViews',
        'is_draft as isDraft',
        'language_id as languageId'
      )

    return ok(
      videos.map((video) => ({
        ...video,
        qtyViews: BigInt(video.qtyViews),
        languageId: BigInt(video.languageId),
      }))
    )
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
