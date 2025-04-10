import _, { Dictionary } from 'lodash'

export const getYoutubeThumbnail = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)

  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
  }

  return ''
}

export function toCamelCase<T extends Record<string, any>>(
  obj: T
): { [K in keyof T as CamelCase<K & string>]: T[K] } {
  return _.mapKeys(obj, (value, key) => _.camelCase(key)) as any
}

type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S

export function toSnakeCase<T extends Record<string, any>>(
  obj: T
): { [K in keyof T as SnakeCase<K & string>]: T[K] } {
  return _.mapKeys(obj, (value, key) => _.snakeCase(key)) as any
}

type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T}${Capitalize<SnakeCase<U>>}`
  : S

/**
 * Shuffle an array
 * @param array
 * @returns
 */
export function shuffleArray(array: any[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

/**
 * Convert a format mm:ss.ms string to seconds
 * @param timestamp
 * @returns
 */
export const parseTimestamp = (timestamp: string) => {
  const [minutes, seconds, milliseconds] = timestamp.split(/[:.]/).map(Number)
  return minutes * 60 + seconds + milliseconds / 1000
}
