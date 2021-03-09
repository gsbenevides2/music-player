import { Sound } from 'expo-av/build/Audio'
import * as Network from 'expo-network'

import { YoutubeService } from '../../../services/youtube'
import { nextMusic } from '../../../utils/nextMusic'
import { ContextType } from '../types'

export const removeArtistFromMusicList = (
  playerContext: ContextType,
  youtubeService: YoutubeService
) => {
  return async (artistsId: string): Promise<void> => {
    const networkState = await Network.getNetworkStateAsync()
    if (!networkState.isInternetReachable) {
      throw new Error('t1')
    }
    if (playerContext?.playerState === undefined) return
    const sound = playerContext?.playerState.sound as Sound
    const actualIndex = playerContext.playerState.musicList.findIndex(
      music => music.id === playerContext.playerState.musicActualy?.id
    ) as number
    const isPlaying =
      playerContext?.playerState.musicActualy?.artist.id === artistsId
    const newMusicList = playerContext.playerState.musicList.filter(
      music => music.artist.id !== artistsId
    )
    if (isPlaying) {
      const newMusicIndex =
        playerContext.playerState.musicList
          .slice(0, actualIndex)
          .filter(music => music.artist.id !== artistsId).length - 1

      const newMusicData = nextMusic({
        isRepeat: playerContext.playerState.isRepeat,
        isShuffle: playerContext.playerState.isShuffle,
        musicList: newMusicList,
        actualMusicIndex: newMusicIndex
      })
      await sound.unloadAsync()
      if (newMusicData.nextMusic) {
        const musicUrl = await youtubeService.getMusicPlayUrl(
          newMusicData.nextMusic.youtubeId
        )
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
        musicActualy: newMusicData.nextMusic || undefined,
        sound
      })
    } else {
      playerContext.setPlayerState({
        ...playerContext.playerState,
        musicList: newMusicList
      })
    }
  }
}
