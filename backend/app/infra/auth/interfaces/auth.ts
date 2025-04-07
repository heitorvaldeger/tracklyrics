export abstract class Auth {
  abstract getUser<T>(): T | null
  abstract getUserId(): number | undefined
  abstract getUserEmail(): string | undefined
  abstract getUserUuid(): string | undefined
  abstract login(email: string, password: string): Promise<void>
}
