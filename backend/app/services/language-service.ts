import { inject } from '@adonisjs/core'
import { ILanguageService } from '#services/interfaces/ILanguageService'
import { LanguageFindModel } from '#models/language-model/language-find-model'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

@inject()
export class LanguageService implements ILanguageService {
  constructor(private readonly findAllRepository: IFindAllRepository<LanguageFindModel>) {}

  async findAll(): Promise<LanguageFindModel[]> {
    return await this.findAllRepository.findAll()
  }
}
