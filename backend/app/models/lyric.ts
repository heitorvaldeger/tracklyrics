import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class Lyric extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare seq: number

  @column()
  declare startTime: string

  @column()
  declare endTime: string

  @column()
  declare line: string

  @column()
  declare videoId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
