import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favorites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary()
      table.primary(['user_id', 'video_id'])
    })
  }
}
