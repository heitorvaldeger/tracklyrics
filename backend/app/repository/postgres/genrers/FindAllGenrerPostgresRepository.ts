import db from '@adonisjs/lucid/services/db'
import { IGenrerResponse } from '#interfaces/IGenrerResponse'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

export class FindAllGenrerPostgresRepository implements IFindAllRepository {
  async findAll(): Promise<IGenrerResponse[]> {
    const genrers: IGenrerResponse[] = await db.from('genrers').select()
    return genrers
  }
}
