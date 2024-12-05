import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class UserLucid extends BaseModel {
  static table = 'users'
  static accessTokens = DbAccessTokensProvider.forModel(UserLucid, {
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

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
