import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'languages'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('flag_country', 2)
    })
  }
}
