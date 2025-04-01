export abstract class Auth {
  abstract getUserId(): number | undefined
  abstract getUserEmail(): string | undefined
  abstract getUserUuid(): string | undefined
}
