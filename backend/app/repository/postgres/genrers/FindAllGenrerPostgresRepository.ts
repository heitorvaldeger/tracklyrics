import db from '@adonisjs/lucid/services/db'
import { IFindAllGenrerRepository } from '#repository/interfaces/IFindAllGenrerRepository'
import { IGenrerResponse } from '#interfaces/IGenrerResponse'

export class FindAllGenrerPostgresRepository implements IFindAllGenrerRepository {
  async findAll(): Promise<IGenrerResponse[]> {
    const genrers: IGenrerResponse[] = await db.from('genrers').select()
    return genrers
  }
}
