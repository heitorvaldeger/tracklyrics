import vine from '@vinejs/vine'

import { GameModesHash } from '#enums/game-modes-hash'

export const gameValidator = vine.compile(
  vine.object({
    uuid: vine.string().trim().uuid(),
    mode: vine.enum(GameModesHash),
  })
)
