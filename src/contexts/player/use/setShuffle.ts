import { ContextType } from '../types'

export const setShuffle = (playerContext: ContextType) => {
  return (): void => {
    playerContext?.setPlayerState({
      ...playerContext.playerState,
      isShuffle: !playerContext.playerState.isShuffle
    })
  }
}
