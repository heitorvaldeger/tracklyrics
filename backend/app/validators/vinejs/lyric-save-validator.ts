import vine from '@vinejs/vine'

import { compareTimeRule } from './rules/compare-time.js'

export const lyricSaveValidator = vine.compile(
  vine.array(
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
  )
)
