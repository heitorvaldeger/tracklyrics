import { ApplicationService } from '@adonisjs/core/types'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'
import { GenreService } from '#services/genre-service'
import { GenrePostgresRepository } from '#repository/postgres-repository/genre-postgres-repository'
import { VideoRepository } from '#repository/protocols/video-repository'
import { VideoPostgresRepository } from '#repository/postgres-repository/video-postgres-repository'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'
import { LanguageService } from '#services/language-service'
import { LanguagePostgresRepository } from '#repository/postgres-repository/language-postgres-repository'
import { FavoriteRepository } from '#repository/protocols/favorite-repository'
import { FavoritePostgresRepository } from '#repository/postgres-repository/favorite-postgres-repository'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { AuthService } from '#services/auth/auth-service'
import { UserRepository } from '#repository/protocols/user-repository'
import { UserPostgresRepository } from '#repository/postgres-repository/user-postgres-repository'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'
import { VideoCurrentUserProtocolService } from '#services/video/protocols/video-currentuser-protocol-service'
import { VideoDeleteProtocolService } from '#services/video/protocols/video-delete-protocol-service'
import { VideoFavoriteProtocolService } from '#services/video/protocols/video-favorite-protocol-service'
import { VideoFindProtocolService } from '#services/video/protocols/video-find-protocol-service'
import { VideoUpdateProtocolService } from '#services/video/protocols/video-update-protocol-service'
import { VideoCreateService } from '#services/video/video-create-service'
import { VideoCurrentUserService } from '#services/video/video-current-user-service'
import { VideoDeleteService } from '#services/video/video-delete-service'
import { VideoFavoriteService } from '#services/video/video-favorite-service'
import { VideoFindService } from '#services/video/video-find-service'
import { VideoUpdateService } from '#services/video/video-update-service'
import { GenreRepository, LanguageRepository } from '#repository/protocols/base-repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    const diMap = [
      { protocol: AuthProtocolService, implementation: AuthService },
      { protocol: LanguageProtocolService, implementation: LanguageService },
      { protocol: GenreProtocolService, implementation: GenreService },
      { protocol: VideoFindProtocolService, implementation: VideoFindService },
      { protocol: VideoDeleteProtocolService, implementation: VideoDeleteService },
      { protocol: VideoCreateProtocolService, implementation: VideoCreateService },
      { protocol: VideoUpdateProtocolService, implementation: VideoUpdateService },
      { protocol: VideoFavoriteProtocolService, implementation: VideoFavoriteService },
      { protocol: VideoCurrentUserProtocolService, implementation: VideoCurrentUserService },

      { protocol: VideoRepository, implementation: VideoPostgresRepository },
      { protocol: FavoriteRepository, implementation: FavoritePostgresRepository },
      { protocol: UserRepository, implementation: UserPostgresRepository },
      { protocol: LanguageRepository, implementation: LanguagePostgresRepository },
      { protocol: GenreRepository, implementation: GenrePostgresRepository },
    ]

    diMap.forEach(({ protocol, implementation }) => {
      this.app.container.bind(protocol, async () => {
        return this.app.container.make(implementation)
      })
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
