import { FindVideoPostgresRepository } from '#repository/postgres/videos/FindVideoPostgresRepository'
import { IFindAllVideoRepository } from '#repository/interfaces/IFindAllVideoRepository'
import { ApplicationService } from '@adonisjs/core/types'
import { FindAllVideoPostgresRepository } from '#repository/postgres/videos/FindAllVideoPostgresRepository'
import { IFindVideoRepository } from '#repository/interfaces/IFindVideoRepository'
import { IVideoService } from '#services/interfaces/IVideoService'
import { VideoService } from '#services/VideoService'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    this.app.container.bind(IFindAllVideoRepository, () => {
      return this.app.container.make(FindAllVideoPostgresRepository)
    })
    this.app.container.bind(IFindVideoRepository, () => {
      return this.app.container.make(FindVideoPostgresRepository)
    })
    this.app.container.bind(IVideoService, () => {
      return this.app.container.make(VideoService)
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
