import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import { Genre } from './genre.js'
import { Language } from './language.js'
import { Lyric } from './lyric.js'
import { User } from './user.js'

export class Video extends BaseModel {
  @column({ isPrimary: true })
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
  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @column()
  declare genreId: number
  @belongsTo(() => Genre)
  declare genre: BelongsTo<typeof Genre>

  @column()
  declare userId: number
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Lyric)
  declare lyrics: HasMany<typeof Lyric>

  @manyToMany(() => User, {
    pivotTable: 'favorites',
    pivotForeignKey: 'video_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['uuid'],
    pivotTimestamps: true,
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
