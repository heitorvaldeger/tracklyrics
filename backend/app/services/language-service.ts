import { inject } from '@adonisjs/core'

import { createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { Language } from '#models/language'
import { LanguageProtocolService } from '#services/_protocols/language-protocol-service'

@inject()
export class LanguageService implements LanguageProtocolService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async findAll(): Promise<MethodResponse<Language[]>> {
    const languages = await this.languageRepository.findAll()
    return createSuccessResponse(languages)
  }
}
