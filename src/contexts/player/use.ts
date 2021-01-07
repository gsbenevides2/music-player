import { useContext } from 'react'

import { PlayerContext } from '.'
import { YoutubeService } from '../../services/youtube'
import { IMusic } from '../../types'
import { LoadedUsecontext } from './types'
import { Sound } from 'expo-av/build/Audio'

export function usePlayerContext(): LoadedUsecontext {
  const playerContext = useContext(PlayerContext)
  const youtubeService = new YoutubeService()

  return {
    async playMusic() {
      const sound = playerContext?.playerState.sound as Sound
      await sound.playAsync()
    },
    async pauseMusic() {
      const sound = playerContext?.playerState.sound as Sound
      await sound.pauseAsync()
    },
    async playNext() {
      const sound = playerContext?.playerState.sound as Sound
      const actualIndex = playerContext?.playerState.musicList.findIndex(
        music => music.id === playerContext.playerState.musicActualy?.id
      ) as number
      if (actualIndex !== playerContext?.playerState.musicList.length) {
        const nextMusic = playerContext?.playerState.musicList[actualIndex + 1]
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
    },
    async playPrevious() {
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
      }
    },
    async startPlaylist(playlist: IMusic[], position: number) {
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
        sound: sound,
        musicList: playlist,
        musicActualy: playlist[position]
      })
    },
    ...playerContext?.playerState
  }
}
