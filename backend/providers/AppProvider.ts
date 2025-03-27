import { ApplicationService } from '@adonisjs/core/types'

import { HashAdapter } from '#infra/crypto/_protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/_protocols/otp-adapter'
import { Crypto } from '#infra/crypto/crypto'
import { CacheAdapter } from '#infra/db/cache/_protocols/cache-adapter'
import { RedisAdonis } from '#infra/db/cache/redis-adonis'
import { FavoriteRepository } from '#infra/db/repository/_protocols/favorite-repository'
import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { UserRepository } from '#infra/db/repository/_protocols/user-repository'
import { VideoPlayCountRepository } from '#infra/db/repository/_protocols/video-play-count-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { FavoritePostgresRepository } from '#infra/db/repository/postgres/favorite-postgres-repository'
import { GenrePostgresRepository } from '#infra/db/repository/postgres/genre-postgres-repository'
import { LanguagePostgresRepository } from '#infra/db/repository/postgres/language-postgres-repository'
import { LyricPostgresRepository } from '#infra/db/repository/postgres/lyric-postgres-repository'
import { UserPostgresRepository } from '#infra/db/repository/postgres/user-postgres-repository'
import { VideoPlayCountPostgresRepository } from '#infra/db/repository/postgres/video-play-count-postgres-repository'
import { VideoPostgresRepository } from '#infra/db/repository/postgres/video-postgres-repository'
import { AuthProtocolService } from '#services/_protocols/auth-protocol-service'
import { FavoriteProtocolService } from '#services/_protocols/favorite-protocol-service'
import { GameProtocolService } from '#services/_protocols/game-protocol-service'
import { GenreProtocolService } from '#services/_protocols/genre-protocol-service'
import { LanguageProtocolService } from '#services/_protocols/language-protocol-service'
import { LyricFindProtocolService } from '#services/_protocols/lyric-find-protocol-service'
import { UserProtocolService } from '#services/_protocols/user-protocol-service'
import { VideoCreateProtocolService } from '#services/_protocols/video/video-create-protocol-service'
import { VideoDeleteProtocolService } from '#services/_protocols/video/video-delete-protocol-service'
import { VideoFindProtocolService } from '#services/_protocols/video/video-find-protocol-service'
import { VideoUpdateProtocolService } from '#services/_protocols/video/video-update-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'
import { AuthService } from '#services/auth-service'
import { FavoriteService } from '#services/favorite-service'
import { GameService } from '#services/game-service'
import { GenreService } from '#services/genre-service'
import { LanguageService } from '#services/language-service'
import { LyricFindService } from '#services/lyric-find-service'
import { UserService } from '#services/user-service'
import { VideoCreateService } from '#services/video-create-service'
import { VideoDeleteService } from '#services/video-delete-service'
import { VideoFindService } from '#services/video-find-service'
import { VideoUpdateService } from '#services/video-update-service'
import { VideoUserLoggedService } from '#services/video-user-logged-service'

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
      { protocol: FavoriteProtocolService, implementation: FavoriteService },
      { protocol: VideoUserLoggedProtocolService, implementation: VideoUserLoggedService },
      { protocol: LyricFindProtocolService, implementation: LyricFindService },
      { protocol: GameProtocolService, implementation: GameService },
      { protocol: UserProtocolService, implementation: UserService },

      { protocol: VideoRepository, implementation: VideoPostgresRepository },
      { protocol: FavoriteRepository, implementation: FavoritePostgresRepository },
      { protocol: UserRepository, implementation: UserPostgresRepository },
      { protocol: LanguageRepository, implementation: LanguagePostgresRepository },
      { protocol: GenreRepository, implementation: GenrePostgresRepository },
      { protocol: VideoPlayCountRepository, implementation: VideoPlayCountPostgresRepository },
      { protocol: LyricRepository, implementation: LyricPostgresRepository },
      { protocol: UserRepository, implementation: UserPostgresRepository },

      { protocol: OTPAdapter, implementation: Crypto },
      { protocol: HashAdapter, implementation: Crypto },

      { protocol: CacheAdapter, implementation: RedisAdonis },
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
