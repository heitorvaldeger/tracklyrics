import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    await db
      .table('languages')
      .knexQuery.insert([
        { id: 1, name: 'English', flag_country: 'us' },
        { id: 2, name: 'Spanish', flag_country: 'es' },
        { id: 3, name: 'Portuguese', flag_country: 'br' },
        { id: 4, name: 'French', flag_country: 'fr' },
        { id: 5, name: 'Italian', flag_country: 'it' },
        { id: 6, name: 'German', flag_country: 'de' },
        { id: 7, name: 'Dutch', flag_country: 'nl' },
        { id: 8, name: 'Japanese (Romaji)', flag_country: 'jp' },
        { id: 9, name: 'Turkish', flag_country: 'tr' },
        { id: 10, name: 'Polish', flag_country: 'pl' },
        { id: 11, name: 'Swedish', flag_country: 'se' },
        { id: 12, name: 'Finnish', flag_country: 'fi' },
      ])
      .onConflict('id')
      .merge()
  }
}
