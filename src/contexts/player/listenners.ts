import { LoadedUsecontext } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPlayerListenners(player: LoadedUsecontext): any[] {
  return [
    player.sound,
    player.musicActualy,
    player.musicList,
    player.isShuffle,
    player.isRepeat
    // player.timeDataTo,
    // player.timeDataFrom
  ]
}
