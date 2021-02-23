import { Sound } from 'expo-av/build/Audio'

import { YoutubeService } from '../../../services/youtube'
import { IMusic } from '../../../types'
import { ContextType } from '../types'

export const startPlaylist = (
  playerContext: ContextType,
  youtubeService: YoutubeService
) => {
  return async (playlist: IMusic[], position: number): Promise<void> => {
    const sound = playerContext?.playerState.sound as Sound
    const musicUrl = await youtubeService.getMusicPlayUrl(
      playlist[position].youtubeId
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
      sound: sound,
      musicList: playlist,
      musicActualy: playlist[position]
    })
  }
}
