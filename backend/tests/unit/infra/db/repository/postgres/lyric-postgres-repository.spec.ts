import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'

import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { LyricPostgresRepository } from '#infra/db/repository/postgres/lyric-postgres-repository'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

const makeSut = () => {
  const sut = new LyricPostgresRepository()
  return { sut }
}

test.group('LyricPostgresRepository', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  group.each.setup(async () => {
    await db.from('lyrics').del()
  })

  test('insert lyrics with success', async ({ expect }) => {
    const { fakeVideo } = await mockAllTables()
    const { sut } = makeSut()

    const lyrics: LyricRepository.LyricParamsToInsert[] = []
    for (let i = 1; i <= 5; i++) {
      lyrics.push({
        seq: i,
        line: faker.lorem.sentence(5),
        startTime: '00:00.00',
        endTime: '00:00.10',
        videoId: fakeVideo.id,
      })
    }

    const lyricsInserted = await sut.save(lyrics)
    const lyricsFromDatabase = await db
      .from('lyrics')
      .orderBy('seq', 'asc')
      .where('video_id', fakeVideo.id)
      .select(['seq', 'line', 'start_time', 'end_time', 'video_id'])
    expect(lyricsInserted.countLyricsInserted).toBe(lyrics.length)
    expect(lyricsFromDatabase.map((lyric) => toCamelCase(lyric))).toEqual(lyrics)
  })

  test('update lyrics with success', async ({ expect }) => {
    const { fakeVideo } = await mockAllTables()
    const { sut } = makeSut()

    const lyrics: LyricRepository.LyricParamsToInsert[] = []
    for (let i = 1; i <= 10; i++) {
      lyrics.push({
        seq: i,
        line: faker.lorem.sentence(5),
        startTime: '00:00.00',
        endTime: '00:00.10',
        videoId: fakeVideo.id,
      })
    }

    await db
      .table('lyrics')
      .knexQuery.insert(lyrics.map(toSnakeCase))
      .onConflict(['video_id', 'seq'])
      .merge()

    lyrics[0].line = faker.lorem.sentence(5)
    delete lyrics[1]
    delete lyrics[2]

    const newLyrics = lyrics
      .filter((lyric) => lyric)
      .map((lyric, idx) => ({
        ...lyric,
        seq: ++idx,
      }))

    const lyricsInserted = await sut.save(newLyrics)
    const lyricsFromDatabase = await db
      .from('lyrics')
      .orderBy('seq', 'asc')
      .where('video_id', fakeVideo.id)
      .select(['seq', 'line', 'start_time', 'end_time', 'video_id'])
    expect(lyricsInserted.countLyricsInserted).toBe(newLyrics.length)
    expect(lyricsFromDatabase.map((lyric) => toCamelCase(lyric))).toEqual(newLyrics)
  })

  test('return a lyrics list by videoId with success', async ({ expect }) => {
    const { fakeVideo } = await mockAllTables()
    const { sut } = makeSut()

    const lyrics: LyricRepository.LyricParamsToInsert[] = []
    for (let i = 1; i <= 10; i++) {
      lyrics.push({
        seq: i,
        line: faker.lorem.sentence(5),
        startTime: '00:00.00',
        endTime: '00:00.10',
        videoId: fakeVideo.id,
      })
    }

    await db
      .table('lyrics')
      .knexQuery.insert(lyrics.map(toSnakeCase))
      .onConflict(['video_id', 'seq'])
      .merge()

    const lyricsFromSut = await sut.find(fakeVideo.id)
    expect(
      lyrics.map(({ seq, line, startTime, endTime }) => ({
        line,
        startTime,
        endTime,
        seq,
      }))
    ).toEqual(lyricsFromSut)
  })
})
