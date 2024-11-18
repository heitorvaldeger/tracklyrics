import _, { Dictionary } from 'lodash'

export function toCamelCase<T extends Record<string, any>>(
  obj: T
): { [K in keyof T as CamelCase<K & string>]: T[K] } {
  return _.mapKeys(obj, (value, key) => _.camelCase(key)) as any
}

type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S
