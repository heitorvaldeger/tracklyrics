import { LanguageLucid } from '#models/language-model/language-lucid'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    const uniqueKey = 'id'

    await LanguageLucid.updateOrCreateMany(uniqueKey, [
      { id: 1, name: 'English' },
      { id: 2, name: 'Spanish' },
      { id: 3, name: 'Portuguese' },
      { id: 4, name: 'French' },
      { id: 5, name: 'Italian' },
      { id: 6, name: 'German' },
      { id: 7, name: 'Dutch' },
      { id: 8, name: 'Japanese (Romaji)' },
      { id: 9, name: 'Turkish' },
      { id: 10, name: 'Polish' },
      { id: 11, name: 'Swedish' },
      { id: 12, name: 'Finnish' },
      { id: 13, name: 'Catalan' },
    ])
  }
}
