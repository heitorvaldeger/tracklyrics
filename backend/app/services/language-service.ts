import { inject } from '@adonisjs/core'

import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { Language } from '#models/language'
import { LanguageProtocolService } from '#services/_protocols/language-protocol-service'

@inject()
export class LanguageService implements LanguageProtocolService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async findAll() {
    return await this.languageRepository.findAll()
  }
}
