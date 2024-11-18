import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { badRequest, serverError } from '#helpers/http'
import {
  createOrUpdateVideoValidator,
  findByVideoValidator,
  uuidVideoValidator,
} from '#validators/video-validator'
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

  async findBy({ request }: HttpContext) {
    try {
      const queryParams = await findByVideoValidator.validate(request.qs())
      const response = await this.videoService.findBy(queryParams)

      return dispatch(response)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async create({ request }: HttpContext) {
    try {
      const payload = await createOrUpdateVideoValidator.validate(request.body())
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
      const payload = await createOrUpdateVideoValidator.validate(request.body())

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

      const deleted = await this.videoService.delete(uuid)
      return dispatch(deleted)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async addFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const added = await this.videoService.addFavorite(uuid)
      return dispatch(added)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async removeFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const result = await this.videoService.removeFavorite(uuid)
      return dispatch(result)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
