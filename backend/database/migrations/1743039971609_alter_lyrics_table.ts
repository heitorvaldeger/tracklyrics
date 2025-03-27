import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lyrics'

  async up() {
    const hasStartTimeColumn = await this.schema.hasColumn(this.tableName, 'start_time')
    if (hasStartTimeColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.string('start_time', 10).alter()
      })
    }

    const hasEndTimeColumn = await this.schema.hasColumn(this.tableName, 'end_time')
    if (hasEndTimeColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.string('end_time', 10).alter()
      })
    }
  }
}
