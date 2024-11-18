import { GenrerFindModel } from '#models/genrer/genrer-find-model'

export abstract class IGenrerService {
  abstract findAll(): Promise<GenrerFindModel[]>
}
