import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GenrerLucid extends BaseModel {
  static table = 'genrers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
