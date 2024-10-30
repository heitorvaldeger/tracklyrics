import { inject } from '@adonisjs/core'
import { ILanguageService } from '#services/interfaces/ILanguageService'
import { ILanguageResponse } from '#interfaces/ILanguageResponse'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

@inject()
export class LanguageService implements ILanguageService {
  constructor(private readonly findAllRepository: IFindAllRepository) {}

  async findAll(): Promise<ILanguageResponse[]> {
    return await this.findAllRepository.findAll()
  }
}
