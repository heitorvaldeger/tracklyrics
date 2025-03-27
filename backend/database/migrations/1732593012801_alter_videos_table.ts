import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  async up() {
    const hasGenreIdColumn = await this.schema.hasColumn(this.tableName, 'genrer_id')
    if (hasGenreIdColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.renameColumn('genrer_id', 'genre_id')
      })
    }
  }
}
