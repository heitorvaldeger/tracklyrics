import { MethodResponse } from '#helpers/types/method-response'
import { Language } from '#models/language'

export abstract class LanguageProtocolService {
  abstract findAll(): Promise<MethodResponse<Language[]>>
}
