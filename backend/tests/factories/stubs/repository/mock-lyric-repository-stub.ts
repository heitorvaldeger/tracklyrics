import { LyricRepository } from '#infra/db/repository/protocols/lyric-repository'

export const mockLyricRepositoryStub = (): LyricRepository => ({
  save: (params: LyricRepository.LyricParamsToInsert[]) =>
    Promise.resolve({
      countLyricsInserted: 2,
    }),
  find: (videoId: number) =>
    Promise.resolve([
      {
        seq: 1,
        startTime: '00:00:00',
        endTime: '00:00:00',
        line: 'any_line',
      },
      {
        seq: 2,
        startTime: '00:00:00',
        endTime: '00:00:00',
        line: 'any_line',
      },
    ]),
})
