import _ from 'lodash'

// export const toSnakeCase = (obj: any) => {
//   return _.mapKeys(obj, (value, key) => _.snakeCase(key))
// }

export function toSnakeCase<T extends Record<string, any>>(
  obj: T
): { [K in keyof T as SnakeCase<K & string>]: T[K] } {
  return _.mapKeys(obj, (value, key) => _.snakeCase(key)) as any
}

type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T}${Capitalize<SnakeCase<U>>}`
  : S
