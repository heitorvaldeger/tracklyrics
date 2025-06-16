import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'
import { GameModesHash } from '#enums/game-modes-hash'

export abstract class IGetGameSchema
  implements
    IValidatorSchema<{
      uuid: string
      mode: GameModesHash
    }>
{
  abstract validateAsync(data: any): Promise<{
    uuid: string
    mode: GameModesHash
  }>
}
