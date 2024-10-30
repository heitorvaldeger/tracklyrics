import { IVideoCreateRequest } from './IVideoCreateRequest.js'

export interface IVideoUpdateRequest extends IVideoCreateRequest {
  uuid: string
}
