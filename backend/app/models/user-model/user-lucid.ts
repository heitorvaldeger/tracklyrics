import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import { UserEmailStatus } from '#enums/user-email-status'
import { Video } from '#models/video'

export class User extends BaseModel {
  static table = 'users'
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

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
