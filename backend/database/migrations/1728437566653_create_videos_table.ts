import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('is_draft')
      table.string('title', 100)
      table.string('artist', 100)
      table.bigInteger('qty_views').unsigned().defaultTo(0)
      table.date('release_year')
      table.string('link_youtube')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
