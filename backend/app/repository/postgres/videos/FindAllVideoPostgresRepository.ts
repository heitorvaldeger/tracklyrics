import db from '@adonisjs/lucid/services/db'
import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IFindAllVideoRepository } from '#repository/interfaces/IFindAllVideoRepository'

export class FindAllVideoPostgresRepository implements IFindAllVideoRepository {
  async findAll(): Promise<IVideoResponse[]> {
    const videos: IVideoResponse[] = await db
      .from('videos')
      .innerJoin('languages', 'languages.id', 'language_id')
      .innerJoin('genrers', 'genrers.id', 'genrer_id')
      .select(
        'title',
        'artist',
        'uuid',
        'release_year as releaseYear',
        'link_youtube as linkYoutube',
        'qty_views as qtyViews',
        'is_draft as isDraft',
        'languages.name as language',
        'genrers.name as genrer'
      )
    return videos
  }
}
