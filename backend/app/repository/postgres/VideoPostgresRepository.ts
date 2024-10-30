import db from '@adonisjs/lucid/services/db'
import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import Video from '#models/video'

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

    if (video) {
      video.qtyViews = BigInt(video.qtyViews)
    }

    return video
  }

  async findByGenrer(genrerId: number): Promise<IVideoResponse[]> {
    const videos: IVideoResponse[] = await db
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

    return this.mapperVideos(videos)
  }

  async findByLanguage(languageId: number): Promise<IVideoResponse[]> {
    const videos: IVideoResponse[] = await db
      .from('videos')
      .where('language_id', languageId)
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

    return this.mapperVideos(videos)
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
    return this.mapperVideos(videos)
  }

  async isVideoAvailable(uuid: string): Promise<boolean> {
    return !!(await db.from('videos').where('uuid', uuid).first())
  }

  async delete(uuid: string): Promise<void> {
    await Video.query().where('uuid', uuid).delete()
  }

  async create(payload: any): Promise<void> {
    await Video.create(payload)
  }

  async update(payload: any, uuid: string): Promise<void> {
    await Video.query().where('uuid', uuid).update(payload)
  }

  private mapperVideos(videos: IVideoResponse[]) {
    return videos.map((video) => ({
      ...video,
      qtyViews: BigInt(video.qtyViews),
    }))
  }
}
