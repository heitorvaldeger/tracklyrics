import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import Video from '#models/video'
import { badRequest, noContent, serverError } from '#helpers/http'
import {
  createOrUpdateVideoValidator,
  genrerIdVideoValidator,
  languageIdVideoValidator,
  uuidVideoValidator,
} from '#validators/VideoValidator'
import { IVideoCreateRequest } from '#interfaces/IVideoCreateRequest'
import { IVideoService } from '#services/interfaces/IVideoService'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'

@inject()
export default class VideoController {
  constructor(private videoService: IVideoService) {}

  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const response = await this.videoService.find(uuid)

      return dispatch(response)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async findByGenrer({ request }: HttpContext) {
    try {
      const { genrerId } = await genrerIdVideoValidator.validate(request.params())
      const response = await this.videoService.findByGenrer(genrerId)

      return dispatch(response)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async findByLanguage({ request }: HttpContext) {
    try {
      const { languageId } = await languageIdVideoValidator.validate(request.params())
      const response = await this.videoService.findByLanguage(languageId)

      return dispatch(response)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async findAll() {
    try {
      const response = await this.videoService.findAll()

      return dispatch(response)
    } catch (error) {
      return serverError(error)
    }
  }

  async create({ request }: HttpContext) {
    try {
      const payload = await createOrUpdateVideoValidator.validate(
        request.body() as IVideoCreateRequest
      )
      const response = await this.videoService.create(payload)
      return dispatch(response)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }

      return serverError(error as Error)
    }
  }

  async update({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const payload = await createOrUpdateVideoValidator.validate(
        request.body() as IVideoCreateRequest
      )

      const response = await this.videoService.update(payload, uuid)
      return dispatch(response)
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

      const result = await this.videoService.delete(uuid)
      return dispatch(result)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
