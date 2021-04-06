import { IMusic } from '../../../types'
import { ContextType } from '../types'

export const addToMusicList = (playerContext: ContextType) => {
  return (music: IMusic): void => {
    const newMusicList = playerContext?.playerState.musicList || []
    newMusicList.push(music)
    playerContext?.setPlayerState({
      ...playerContext.playerState,
      musicList: newMusicList
    })
  }
}
