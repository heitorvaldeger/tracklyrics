import { BaseSchema } from '@adonisjs/lucid/schema'

import { UserEmailStatus } from '#enums/user-email-status'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('email_status', Object.values(UserEmailStatus))
        .defaultTo(UserEmailStatus.UNVERIFIED)
    })
  }
}
