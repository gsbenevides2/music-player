import { IMusic } from '../../../types'
import { ContextType } from '../types'

export const addToNextMusicList = (playerContext: ContextType) => {
  return (music: IMusic): void => {
    const actualMusicList = playerContext?.playerState.musicList || []
    const actualMusicIndex = actualMusicList.findIndex(music => {
      return music.id === playerContext?.playerState.musicActualy?.id
    })
    const partOne = actualMusicList.slice(0, actualMusicIndex)
    const partTwo = actualMusicList.slice(
      actualMusicIndex,
      actualMusicList.length - 1
    )

    playerContext?.setPlayerState({
      ...playerContext.playerState,
      musicList: [...partOne, music, ...partTwo]
    })
  }
}
