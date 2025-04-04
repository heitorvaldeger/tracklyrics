import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import { Video } from './video.js'

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

  @belongsTo(() => Video)
  declare video: BelongsTo<typeof Video>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
