import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class VideoLucid extends BaseModel {
  static table = 'videos'

  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column()
  declare isDraft: boolean

  @column()
  declare title: string

  @column()
  declare artist: string

  @column()
  declare releaseYear: string

  @column()
  declare linkYoutube: string

  @column()
  declare uuid: string

  @column()
  declare languageId: number

  @column()
  declare genreId: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
