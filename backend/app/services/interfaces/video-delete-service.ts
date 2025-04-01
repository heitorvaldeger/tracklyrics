export abstract class IVideoDeleteService {
  abstract delete(uuid: string): Promise<boolean>
}
