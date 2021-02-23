import { IMusic } from '../../../types'
import { ContextType } from '../types'

export const setMusicList = (playerContext: ContextType) => {
  return (musics: IMusic[]): void => {
    playerContext?.setPlayerState({
      ...playerContext.playerState,
      musicList: musics
    })
  }
}
