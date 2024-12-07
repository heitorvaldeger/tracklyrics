export abstract class RedisAdapter {
  abstract set(key: string, value: string): Promise<void>
}
