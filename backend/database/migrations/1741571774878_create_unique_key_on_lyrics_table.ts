import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lyrics'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['video_id', 'seq'])
    })
  }
}
