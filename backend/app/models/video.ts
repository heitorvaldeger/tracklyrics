import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Video extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column()
  declare isDraft: boolean

  @column()
  declare title: string

  @column()
  declare artist: string

  @column({
    consume: (value: bigint) => BigInt(value),
  })
  declare qtyViews: bigint

  @column()
  declare releaseYear: string

  @column()
  declare linkYoutube: string

  @column()
  declare uuid: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
