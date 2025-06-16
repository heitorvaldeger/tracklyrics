interface Lyric {
  id: number
  seq: number
  startTime: string
  endTime: string
  line: string
  videoId: number
}

export interface LyricResponseWithoutIds extends Omit<Lyric, 'id' | 'videoId'> {}
export interface LyricToInsert extends Omit<Lyric, 'id'> {}

export abstract class ILyricRepository {
  abstract save(lyrics: LyricToInsert[], videoId: number): Promise<{ lyricsCount: number }>
  abstract find(videoId: number): Promise<LyricResponseWithoutIds[]>
}
