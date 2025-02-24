import { ApplicationService } from '@adonisjs/core/types'

import { CryptoAdapter } from '#infra/crypto/crypto-adapter'
import { HashAdapter } from '#infra/crypto/protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'
import { CacheAdapter } from '#infra/db/cache/protocols/cache-adapter'
import { RedisAdonisAdapter } from '#infra/db/cache/redis-adonis-adapter'
import { FavoritePostgresRepository } from '#infra/db/repository/postgres/favorite-postgres-repository'
import { GenrePostgresRepository } from '#infra/db/repository/postgres/genre-postgres-repository'
import { LanguagePostgresRepository } from '#infra/db/repository/postgres/language-postgres-repository'
import { LyricPostgresRepository } from '#infra/db/repository/postgres/lyric-postgres-repository'
import { UserPostgresRepository } from '#infra/db/repository/postgres/user-postgres-repository'
import { VideoPlayCountPostgresRepository } from '#infra/db/repository/postgres/video-play-count-postgres-repository'
import { VideoPostgresRepository } from '#infra/db/repository/postgres/video-postgres-repository'
import { FavoriteRepository } from '#infra/db/repository/protocols/favorite-repository'
import { GenreRepository } from '#infra/db/repository/protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'
import { LyricRepository } from '#infra/db/repository/protocols/lyric-repository'
import { UserRepository } from '#infra/db/repository/protocols/user-repository'
import { VideoPlayCountRepository } from '#infra/db/repository/protocols/video-play-count-repository'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { AuthService } from '#services/auth/auth-service'
import { FavoriteService } from '#services/favorite-service'
import { GameService } from '#services/game-service'
import { GenreService } from '#services/genre-service'
import { LanguageService } from '#services/language-service'
import { LyricFindService } from '#services/lyric/lyric-find-service'
import { LyricSaveService } from '#services/lyric/lyric-save-service'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { FavoriteProtocolService } from '#services/protocols/favorite-protocol-service'
import { GameProtocolService } from '#services/protocols/game-protocol-service'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'
import { LyricFindProtocolService } from '#services/protocols/lyric/lyric-find-protocol-service'
import { LyricSaveProtocolService } from '#services/protocols/lyric/lyric-save-protocol-service'
import { RegisterProtocolService } from '#services/protocols/register-protocol-service'
import { UserProtocolService } from '#services/protocols/user-protocol-service'
import { VideoCreateProtocolService } from '#services/protocols/video/video-create-protocol-service'
import { VideoDeleteProtocolService } from '#services/protocols/video/video-delete-protocol-service'
import { VideoFindProtocolService } from '#services/protocols/video/video-find-protocol-service'
import { VideoUpdateProtocolService } from '#services/protocols/video/video-update-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/protocols/video/video-user-logged-protocol-service'
import { UserService } from '#services/user-service'
import { VideoCreateService } from '#services/video/video-create-service'
import { VideoDeleteService } from '#services/video/video-delete-service'
import { VideoFindService } from '#services/video/video-find-service'
import { VideoUpdateService } from '#services/video/video-update-service'
import { VideoUserLoggedService } from '#services/video/video-user-logged-service'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    const diMap = [
      { protocol: AuthProtocolService, implementation: AuthService },
      { protocol: RegisterProtocolService, implementation: AuthService },
      { protocol: LanguageProtocolService, implementation: LanguageService },
      { protocol: GenreProtocolService, implementation: GenreService },
      { protocol: VideoFindProtocolService, implementation: VideoFindService },
      { protocol: VideoDeleteProtocolService, implementation: VideoDeleteService },
      { protocol: VideoCreateProtocolService, implementation: VideoCreateService },
      { protocol: VideoUpdateProtocolService, implementation: VideoUpdateService },
      { protocol: FavoriteProtocolService, implementation: FavoriteService },
      { protocol: VideoUserLoggedProtocolService, implementation: VideoUserLoggedService },
      { protocol: LyricSaveProtocolService, implementation: LyricSaveService },
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

      { protocol: OTPAdapter, implementation: CryptoAdapter },
      { protocol: HashAdapter, implementation: CryptoAdapter },

      { protocol: CacheAdapter, implementation: RedisAdonisAdapter },
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
