import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lyrics'

  async up() {
    const hasLyricColumn = await this.schema.hasColumn(this.tableName, 'lyric')
    if (hasLyricColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.renameColumn('lyric', 'line')
      })
    }
  }
}
