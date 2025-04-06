import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'

import { LyricToInsert } from '#infra/db/repository/interfaces/lyric-repository'
import { LyricPostgresRepository } from '#infra/db/repository/lyric-repository'
import { Lyric } from '#models/lyric'
import { mockVideo } from '#tests/__mocks__/db/mock-all'
import { mockGenre } from '#tests/__mocks__/db/mock-genre'
import { mockLanguage } from '#tests/__mocks__/db/mock-language'
import { mockUser } from '#tests/__mocks__/db/mock-user'
import { toCamelCase } from '#utils/index'

const createData = async () => {
  const [fakeLanguage, fakeGenre, fakeUser] = await Promise.all([
    mockLanguage(),
    mockGenre(),
    mockUser(),
  ])
  const fakeVideo = await mockVideo({ fakeLanguage, fakeGenre, fakeUser })

  return { fakeVideo, fakeUser, fakeLanguage, fakeGenre }
}

const makeSut = () => {
  const sut = new LyricPostgresRepository()
  return { sut }
}

test.group('LyricPostgresRepository', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('insert lyrics with success', async ({ expect }) => {
    const { fakeVideo } = await createData()
    const { sut } = makeSut()

    const lyrics: LyricToInsert[] = []
    for (let i = 1; i <= 5; i++) {
      lyrics.push({
        seq: i,
        line: faker.lorem.sentence(5),
        startTime: '00:00.00',
        endTime: '00:00.10',
        videoId: fakeVideo.id,
      })
    }

    const lyricsInserted = await sut.save(lyrics, fakeVideo.id)
    const lyricsFromDatabase = await db
      .from('lyrics')
      .orderBy('seq', 'asc')
      .where('video_id', fakeVideo.id)
      .select(['seq', 'line', 'start_time', 'end_time', 'video_id'])
    expect(lyricsInserted.lyricsCount).toBe(lyrics.length)
    expect(lyricsFromDatabase.map((lyric) => toCamelCase(lyric))).toEqual(lyrics)
  })

  test('update lyrics with success', async ({ expect }) => {
    const { fakeVideo } = await createData()
    const { sut } = makeSut()

    const lyrics: LyricToInsert[] = []
    for (let i = 1; i <= 10; i++) {
      lyrics.push({
        seq: i,
        line: faker.lorem.sentence(5),
        startTime: '00:00.00',
        endTime: '00:00.10',
        videoId: fakeVideo.id,
      })
    }

    await Lyric.createMany(lyrics)

    lyrics[0].line = faker.lorem.sentence(5)
    delete lyrics[1]
    delete lyrics[2]

    const newLyrics = lyrics
      .filter((lyric) => lyric)
      .map((lyric, idx) => ({
        ...lyric,
        seq: ++idx,
      }))

    const lyricsInserted = await sut.save(newLyrics, fakeVideo.id)
    const lyricsFromDatabase = (
      await Lyric.query()
        .where('videoId', fakeVideo.id)
        .orderBy('seq', 'asc')
        .select(['seq', 'line', 'startTime', 'endTime', 'videoId'])
    ).map((lyric) => lyric.serialize())

    expect(lyricsInserted.lyricsCount).toBe(newLyrics.length)
    expect(lyricsFromDatabase).toEqual(newLyrics)
  })

  test('return a lyrics list by videoId with success', async ({ expect }) => {
    const { fakeVideo } = await createData()
    const { sut } = makeSut()

    const lyricsToInsert: LyricToInsert[] = []
    for (let i = 1; i <= 10; i++) {
      lyricsToInsert.push({
        seq: i,
        line: faker.lorem.sentence(5),
        startTime: '00:00.00',
        endTime: '00:00.10',
        videoId: fakeVideo.id,
      })
    }

    await Lyric.createMany(lyricsToInsert)

    const lyrics = await sut.find(fakeVideo.id)
    expect(
      lyricsToInsert.map(({ seq, line, startTime, endTime }) => ({
        line,
        startTime,
        endTime,
        seq,
      }))
    ).toEqual(lyrics)
  })
})
