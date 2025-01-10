import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
type Options = {
  fieldName: string
  operation: 'more' | 'less'
}

async function compareTime(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  const timeOne = field.parent[options.fieldName] as string
  const timeTwo = value as string

  const isTimeTwoFormatInvalid = !timeTwo.match(/^([01]\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/)
  const isTimeOneFormatInvalid = !timeOne.match(/^([01]\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/)
  if (isTimeTwoFormatInvalid) {
    field.report(`The {{field}} field must be pattern 00:00:00`, 'compareTime', field)
  }

  if (isTimeOneFormatInvalid) {
    field.name = options.fieldName
    field.report(`The ${options.fieldName} field must be pattern 00:00:00`, 'compareTime', field)
  }

  if (isTimeOneFormatInvalid || isTimeTwoFormatInvalid) return

  const [h1, m1, s1] = timeOne.split(':').map(Number)
  const [h2, m2, s2] = timeTwo.split(':').map(Number)

  const isInvalid =
    options.operation === 'less' ? h1 < h2 || m1 < m2 || s1 < s2 : h1 > h2 || m1 > m2 || s1 > s2
  if (isInvalid) {
    field.report(
      options.operation === 'less'
        ? `The {{field}} field must be less than the ${options.fieldName} field`
        : `The {{field}} field must be more than the ${options.fieldName} field`,
      'compareTime',
      field
    )
  }
}

/**
 * Compare two times using operators more or less using the format 00:00:00
 */
export const compareTimeRule = vine.createRule(compareTime)
