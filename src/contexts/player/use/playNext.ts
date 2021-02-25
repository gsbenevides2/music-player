import { Sound } from 'expo-av/build/Audio'

import { YoutubeService } from '../../../services/youtube'
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
    async function playNextMusicInOrder(): Promise<void> {
      const nextMusic = musicList[actualIndex + 1]
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
    async function playNextMusicInShuffle(): Promise<void> {
      const musicsNotPlayed = musicList.slice(actualIndex + 1)
      const nextMusicIndex = Math.floor(Math.random() * musicsNotPlayed.length)
      const nextMusic = musicsNotPlayed[nextMusicIndex]
      const actualMusic = musicList[actualIndex]
      const musicsPlayed = musicList.slice(0, actualIndex)
      const newMusicNotPlayed = musicsNotPlayed.filter(
        music => music.id !== nextMusic.id
      )
      const newMusicList = [
        ...musicsPlayed,
        actualMusic,
        nextMusic,
        ...newMusicNotPlayed
      ]
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
        musicList: newMusicList,
        musicActualy: nextMusic
      })
    }

    async function playNextMusicInOrderWithRepeat(): Promise<void> {
      const nextMusic = musicList[0]
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
    async function playNextMusicInShuffleWithRepeat(): Promise<void> {
      const actualMusic = musicList[actualIndex]
      const musicsNotPlayed = musicList.filter(
        music => music.id !== actualMusic.id
      )
      const nextMusicIndex = Math.floor(Math.random() * musicsNotPlayed.length)
      const nextMusic = musicsNotPlayed[nextMusicIndex]
      const newMusicNotPlayed = musicsNotPlayed.filter(
        music => music.id !== nextMusic.id
      )
      const newMusicList = [actualMusic, nextMusic, ...newMusicNotPlayed]
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
        musicList: newMusicList,
        musicActualy: nextMusic
      })
    }

    if (actualIndex === musicList.length - 1) {
      if (playerContext.playerState.isRepeat) {
        if (playerContext?.playerState.isShuffle) {
          playNextMusicInShuffleWithRepeat()
        } else {
          playNextMusicInOrderWithRepeat()
        }
        // eslint-disable-next-line no-useless-return
      } else return
    } else if (playerContext?.playerState.isShuffle) playNextMusicInShuffle()
    else playNextMusicInOrder()
  }
}
