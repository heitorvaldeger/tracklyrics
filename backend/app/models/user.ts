import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import { UserEmailStatus } from '#enums/user-email-status'

import { Video } from './video.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export class User extends compose(BaseModel, AuthFinder) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare email: string

  @column({
    serializeAs: null,
  })
  declare password: string

  @column()
  declare username: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare emailStatus: UserEmailStatus

  @manyToMany(() => Video, {
    pivotTable: 'favorites',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'video_id',
    pivotColumns: ['uuid'],
    pivotTimestamps: true,
  })
  declare videos: ManyToMany<typeof Video>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}

const UserLucid = User
export default UserLucid
