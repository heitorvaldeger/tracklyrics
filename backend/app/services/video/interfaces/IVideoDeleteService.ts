import { IMethodResponse } from '#helpers/types/IMethodResponse'

export abstract class IVideoDeleteService {
  abstract delete(uuid: string): Promise<IMethodResponse<boolean>>
}
