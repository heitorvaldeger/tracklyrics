import { test } from '@japa/runner'
import vine from '@vinejs/vine'
import { stub } from 'sinon'

import { createSuccessResponse } from '#helpers/method-response'
import { compareTimeRule } from '#validators/vinejs/rules/compare-time'

const makeSut = () => {
  const sut = vine.compile(
    vine.object({
      startTime: vine.string().use(
        compareTimeRule({
          fieldName: 'endTime',
          operation: 'less',
        })
      ),
      endTime: vine.string(),
    })
  )

  return {
    sut,
  }
}

const otherMakeSut = () => {
  const sut = vine.compile(
    vine.object({
      startTime: vine.string(),
      endTime: vine.string().use(
        compareTimeRule({
          fieldName: 'startTime',
          operation: 'more',
        })
      ),
    })
  )

  return {
    sut,
  }
}

test.group('CompareTime Validator Rule', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return a fail if startTime is more than endTime', async ({ expect }) => {
    const { sut } = makeSut()
    const isValid = await sut.tryValidate({
      startTime: '00:00:10',
      endTime: '00:00:00',
    })

    expect(isValid[0]?.code).toBe('E_VALIDATION_ERROR')
  })

  test('return a fail if endTime is less than startTime', async ({ expect }) => {
    const { sut } = otherMakeSut()
    const isValid = await sut.tryValidate({
      startTime: '00:00:10',
      endTime: '00:00:00',
    })

    expect(isValid[0]?.code).toBe('E_VALIDATION_ERROR')
  })

  test('return a fail if endTime is less than startTime', async ({ expect }) => {
    const sut = vine.compile(
      vine.object({
        startTime: vine.string(),
        endTime: vine.number().use(
          compareTimeRule({
            fieldName: 'startTime',
            operation: 'more',
          })
        ),
      })
    )
    const isValid = await sut.tryValidate({
      startTime: '00:00:10',
      endTime: 0,
    })

    expect(isValid[0]).toBeFalsy()
  })
})
