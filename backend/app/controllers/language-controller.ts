import { inject } from '@adonisjs/core'

import { dispatch } from '#helpers/dispatch'
import { ok } from '#helpers/http'
import { LanguageProtocolService } from '#services/_protocols/language-protocol-service'

@inject()
export default class LanguageController {
  constructor(private readonly languageService: LanguageProtocolService) {}

  async findAll() {
    try {
      const languages = await this.languageService.findAll()

      return dispatch(languages)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
