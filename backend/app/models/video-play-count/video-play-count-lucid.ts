import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class VideoPlayCountLucid extends BaseModel {
  static table = 'video_play_counts'

  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column()
  declare videoId: number

  @column()
  declare playCount: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
