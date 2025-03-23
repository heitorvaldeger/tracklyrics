export abstract class Auth {
  abstract getUserId(): number
  abstract getUserEmail(): string | undefined
  abstract getUserUuid(): string | undefined
}
