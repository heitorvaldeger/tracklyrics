import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AuthAccessTokenLucid extends BaseModel {
  static table = 'auth_access_tokens'

  @column({ isPrimary: true, serializeAs: null })
  declare id: number
}
