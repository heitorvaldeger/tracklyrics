import { IVideoCreateService } from './video-create-service.js'

export abstract class IVideoUpdateService {
  abstract update(payload: IVideoUpdateService.Params, uuid: string): Promise<boolean>
}

export namespace IVideoUpdateService {
  export type Params = IVideoCreateService.Params
}
