import { ApplicationService } from '@adonisjs/core/types'
import { IVideoService } from '#services/interfaces/IVideoService'
import { IGenreService } from '#services/interfaces/IGenreService'
import { GenreService } from '#services/genre-service'
import { GenrePostgresRepository } from '#repository/postgres-repository/genre-postgres-repository'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { VideoService } from '#services/video-service'
import { VideoPostgresRepository } from '#repository/postgres-repository/video-postgres-repository'
import { ILanguageService } from '#services/interfaces/ILanguageService'
import { LanguageService } from '#services/language-service'
import { LanguagePostgresRepository } from '#repository/postgres-repository/language-postgres-repository'
import { IFavoriteRepository } from '#repository/interfaces/IFavoriteRepository'
import { FavoritePostgresRepository } from '#repository/postgres-repository/favorite-postgres-repository'
import { IVideoDeleteService } from '#services/video/interfaces/IVideoDeleteService'
import { VideoDeleteService } from '#services/video/video-delete-service'
import { IVideoCreateService } from '#services/video/interfaces/IVideoCreateService'
import { VideoCreateService } from '#services/video/video-create-service'
import { IVideoUpdateService } from '#services/video/interfaces/IVideoUpdateService'
import { VideoUpdateService } from '#services/video/video-update-service'
import { IVideoOwnedByCurrentUser } from '#services/video/interfaces/IVideoOwnedByCurrentUser'
import { VideoOwnedByCurrentUserService } from '#services/video/videoowned-by-current-user-service'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    this.app.container.bind(IVideoService, async () => {
      return this.app.container.make(VideoService)
    })

    this.app.container.bind(IVideoDeleteService, async () => {
      return this.app.container.make(VideoDeleteService)
    })

    this.app.container.bind(IVideoCreateService, async () => {
      return this.app.container.make(VideoCreateService)
    })

    this.app.container.bind(IVideoUpdateService, async () => {
      return this.app.container.make(VideoUpdateService)
    })

    this.app.container.bind(IVideoOwnedByCurrentUser, async () => {
      return this.app.container.make(VideoOwnedByCurrentUserService)
    })

    this.app.container.bind(IVideoRepository, async () => {
      return this.app.container.make(VideoPostgresRepository)
    })

    this.app.container.bind(IFavoriteRepository, async () => {
      return this.app.container.make(FavoritePostgresRepository)
    })

    this.app.container.bind(IGenreService, async () => {
      return new GenreService(await this.app.container.make(GenrePostgresRepository))
    })

    this.app.container.bind(ILanguageService, async () => {
      return new LanguageService(await this.app.container.make(LanguagePostgresRepository))
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
