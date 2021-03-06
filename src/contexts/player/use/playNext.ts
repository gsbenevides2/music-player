import { Sound } from 'expo-av/build/Audio'

import { YoutubeService } from '../../../services/youtube'
import { nextMusic } from '../../../utils/nextMusic'
import { ContextType } from '../types'

export const playNext = (
  playerContext: ContextType,
  youtubeService: YoutubeService
) => {
  return async (): Promise<void> => {
    if (playerContext?.playerState === undefined) return
    const sound = playerContext?.playerState.sound as Sound
    const musicList = playerContext?.playerState.musicList
    const actualIndex = musicList.findIndex(
      music => music.id === playerContext.playerState.musicActualy?.id
    ) as number
    const newMusicData = nextMusic({
      isRepeat: playerContext.playerState.isRepeat,
      isShuffle: playerContext.playerState.isShuffle,
      musicList,
      actualMusicIndex: actualIndex
    })
    if (newMusicData.nextMusic) {
      const musicUrl = await youtubeService.getMusicPlayUrl(
        newMusicData.nextMusic.youtubeId
      )
      await sound.unloadAsync()
      await sound.loadAsync(
        {
          uri: musicUrl
        },
        { shouldPlay: true }
      )
    }
    playerContext.setPlayerState({
      ...playerContext.playerState,
      musicList: newMusicData.newMusicList,
      musicActualy:
        newMusicData.nextMusic || playerContext.playerState.musicActualy,
      sound
    })
  }
}
