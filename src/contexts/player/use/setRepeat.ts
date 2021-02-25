import { ContextType } from '../types'

export const setRepeat = (playerContext: ContextType) => {
  return (): void => {
    playerContext?.setPlayerState({
      ...playerContext.playerState,
      isRepeat: !playerContext.playerState.isRepeat
    })
  }
}
