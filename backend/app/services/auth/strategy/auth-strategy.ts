export abstract class AuthStrategy {
  abstract getUserId(): number
  abstract getUserEmail(): string | undefined
}
