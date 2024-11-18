export abstract class IFindAllRepository {
  abstract findAll(): Promise<any[]>
}
