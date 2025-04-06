import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'video_play_counts'

  async up() {
    this.schema.renameTable(this.tableName, 'plays')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
