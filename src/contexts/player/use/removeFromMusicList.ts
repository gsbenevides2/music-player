import { Sound } from 'expo-av/build/Audio'
import { YoutubeService } from '../../../services/youtube'
import { IMusic } from '../../../types'
import { ContextType } from '../types'

export const removeFromMusicList = (
  playerContext: ContextType,
  youtubeService: YoutubeService
) => {
  return async (musicId: string): Promise<void> => {
    if (playerContext?.playerState === undefined) return
    const sound = playerContext?.playerState.sound as Sound
    const musicList = playerContext.playerState.musicList.filter(
      music => music.id !== musicId
    )
    const actualIndex = playerContext.playerState.musicList.findIndex(
      music => music.id === playerContext.playerState.musicActualy?.id
    ) as number
    async function playNextMusicInOrder(): Promise<void> {
      const nextMusic = playerContext?.playerState.musicList[
        actualIndex + 1
      ] as IMusic
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
        musicList,
        sound,
        musicActualy: nextMusic
      })
    }
    async function playNextMusicInShuffle(): Promise<void> {
      const musicsNotPlayed = playerContext?.playerState.musicList.slice(
        actualIndex + 1
      ) as IMusic[]
      const nextMusicIndex = Math.floor(Math.random() * musicsNotPlayed.length)
      const nextMusic = musicsNotPlayed[nextMusicIndex]
      const musicsPlayed = playerContext?.playerState.musicList.slice(
        0,
        actualIndex
      ) as IMusic[]
      const newMusicNotPlayed = musicsNotPlayed.filter(
        music => music.id !== nextMusic.id
      )
      const newMusicList = [...musicsPlayed, nextMusic, ...newMusicNotPlayed]
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
      const nextMusic = playerContext?.playerState.musicList[0] as IMusic
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
        musicList,
        sound,
        musicActualy: nextMusic
      })
    }
    async function playNextMusicInShuffleWithRepeat(): Promise<void> {
      const musicsNotPlayed = playerContext?.playerState.musicList.filter(
        music => music.id !== nextMusic.id
      ) as IMusic[]
      const nextMusicIndex = Math.floor(Math.random() * musicsNotPlayed.length)
      const nextMusic = musicsNotPlayed[nextMusicIndex]
      const newMusicNotPlayed = musicsNotPlayed.filter(
        music => music.id !== nextMusic.id
      )
      const newMusicList = [nextMusic, ...newMusicNotPlayed]
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
    const isPlaying = playerContext?.playerState.musicActualy?.id === musicId
    if (isPlaying) {
      // eslint-disable-next-line no-useless-return
      if (actualIndex === playerContext.playerState.musicList.length - 1) {
        if (
          !playerContext.playerState.isRepeat ||
          playerContext.playerState.musicList.length === 1
        ) {
          await sound.unloadAsync()
          playerContext?.setPlayerState({
            ...playerContext.playerState,
            musicList,
            sound,
            musicActualy: undefined
          })
        } else if (playerContext.playerState.isRepeat) {
          if (playerContext?.playerState.isShuffle)
            playNextMusicInShuffleWithRepeat()
          else playNextMusicInOrderWithRepeat()
        }
      } else if (playerContext?.playerState.isShuffle) playNextMusicInShuffle()
      else playNextMusicInOrder()
    } else {
      playerContext?.setPlayerState({
        ...playerContext.playerState,
        musicList: musicList as IMusic[]
      })
    }
  }
}
