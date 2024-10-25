import db from '@adonisjs/lucid/services/db'
import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'

export class VideoPostgresRepository implements IVideoRepository {
  async find(uuid: string): Promise<IVideoResponse | null> {
    const video: IVideoResponse | null = await db
      .from('videos')
      .where('uuid', uuid)
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
      .first()

    console.log(video)
    return video
  }

  async findByGenrer(genrerId: number): Promise<IVideoResponse | null> {
    const video: IVideoResponse | null = await db
      .from('videos')
      .where('genrer_id', genrerId)
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
      .first()

    return video
  }

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
