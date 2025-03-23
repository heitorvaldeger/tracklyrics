import vine from '@vinejs/vine'

import { compareTimeRule } from './rules/compare-time.js'

const youtubeLinkRegex =
  /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

export const createOrUpdateVideoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    artist: vine.string().trim().minLength(3),
    isDraft: vine.boolean().optional(),
    releaseYear: vine
      .string()
      .trim()
      .fixedLength(4)
      .regex(/^[0-9]+$/),
    linkYoutube: vine.string().regex(youtubeLinkRegex).url(),
    languageId: vine.number(),
    genreId: vine.number(),
    lyrics: vine.array(
      vine.object({
        line: vine.string().trim().minLength(1),
        startTime: vine
          .string()
          .trim()
          .use(
            compareTimeRule({
              fieldName: 'endTime',
              operation: 'less',
            })
          ),
        endTime: vine.string().trim(),
      })
    ),
  })
)

export const findByVideoValidator = vine.compile(
  vine.object({
    genreId: vine.number().positive().optional(),
    languageId: vine.number().positive().optional(),
    userUuid: vine.string().uuid().optional(),
  })
)
