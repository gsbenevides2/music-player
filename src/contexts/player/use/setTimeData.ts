import { ContextType } from '../types'

export const setTimeData = (playerContext: ContextType) => {
  return (to: number, from: number): void => {
    playerContext?.setPlayerState({
      ...playerContext.playerState,
      timeDataTo: to,
      timeDataFrom: from
    })
  }
}
