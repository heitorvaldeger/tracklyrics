import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  async up() {
    const hasQtyViewsColumn = await this.schema.hasColumn(this.tableName, 'qty_views')
    if (hasQtyViewsColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('qty_views')
      })
    }
  }
}
