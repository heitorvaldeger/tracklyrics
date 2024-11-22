import { GenrerFindModel } from '#models/genrer-model/genrer-find-model'

export abstract class IGenrerService {
  abstract findAll(): Promise<GenrerFindModel[]>
}
