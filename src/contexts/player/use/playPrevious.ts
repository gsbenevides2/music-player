import { Sound } from 'expo-av/build/Audio'

import { YoutubeService } from '../../../services/youtube'
import { ContextType } from '../types'

export const playPrevious = (
  playerContext: ContextType,
  youtubeService: YoutubeService
) => {
  return async (): Promise<void> => {
    const sound = playerContext?.playerState.sound as Sound
    const actualIndex = playerContext?.playerState.musicList.findIndex(
      music => music.id === playerContext.playerState.musicActualy?.id
    ) as number
    if (actualIndex !== 0) {
      const nextMusic = playerContext?.playerState.musicList[actualIndex - 1]
      if (nextMusic) {
        const musicUrl = await youtubeService.getMusicPlayUrl(
          nextMusic?.youtubeId
        )
        await sound.unloadAsync()
        await sound.loadAsync(
          {
            uri: musicUrl
          },
          { shouldPlay: true }
        )
        playerContext?.setPlayerState({
          ...playerContext.playerState,
          sound,
          musicActualy: nextMusic
        })
      }
    } else if (actualIndex === 0 && playerContext?.playerState.isRepeat) {
      const nextMusic =
        playerContext?.playerState.musicList[
          playerContext.playerState.musicList.length - 1
        ]
      if (nextMusic) {
        const musicUrl = await youtubeService.getMusicPlayUrl(
          nextMusic?.youtubeId
        )
        await sound.unloadAsync()
        await sound.loadAsync(
          {
            uri: musicUrl
          },
          { shouldPlay: true }
        )
        playerContext?.setPlayerState({
          ...playerContext.playerState,
          sound,
          musicActualy: nextMusic
        })
      }
    }
  }
}
