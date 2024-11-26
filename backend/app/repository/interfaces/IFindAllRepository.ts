export abstract class IFindAllRepository<T> {
  abstract findAll(): Promise<T[]>
}
