import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class LanguageLucid extends BaseModel {
  static table = 'languages'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare flagCountry: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
