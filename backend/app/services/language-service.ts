import { inject } from '@adonisjs/core'

import { LanguageFindModel } from '#models/language-model/language-find-model'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'

import { LanguageRepository } from '../infra/db/protocols/base-repository.js'

@inject()
export class LanguageService implements LanguageProtocolService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async findAll(): Promise<LanguageFindModel[]> {
    return await this.languageRepository.findAll()
  }
}
