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
   * Ensure the value is a string. If not, let the "string" rule handle validation.
   */
  if (typeof value !== 'string') {
    return
  }

  const timeOne = field.parent[options.fieldName] as string
  const timeTwo = value as string

  const timePattern = /^(\d{2}):(\d{2})\.(\d{2})$/

  const isTimeTwoFormatInvalid = !timeTwo.match(timePattern)
  const isTimeOneFormatInvalid = !timeOne.match(timePattern)

  if (isTimeTwoFormatInvalid) {
    field.report(`The {{field}} field must be in the format MM:SS.ss`, 'compareTime', field)
  }

  if (isTimeOneFormatInvalid) {
    field.name = options.fieldName
    field.report(
      `The ${options.fieldName} field must be in the format MM:SS.ss`,
      'compareTime',
      field
    )
  }

  if (isTimeOneFormatInvalid || isTimeTwoFormatInvalid) return false

  const parseTime = (time: string) => {
    const [minutes, seconds, milliseconds] = time.split(/[:.]/).map(Number)
    return minutes * 60000 + seconds * 1000 + milliseconds * 10 // Ajustando milissegundos para duas casas decimais
  }

  const timeOneMs = parseTime(timeOne)
  const timeTwoMs = parseTime(timeTwo)

  const isInvalid = options.operation === 'less' ? timeOneMs < timeTwoMs : timeOneMs > timeTwoMs
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
 * Compare two times using operators more or less using the format MM:SS.ss
 */
export const compareTimeRule = vine.createRule(compareTime)
