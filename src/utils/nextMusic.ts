import { IMusic } from '../types'

interface DataParam {
  musicList: IMusic[]
  isShuffle: boolean
  isRepeat: boolean
  actualMusicIndex: number
}
interface ReturnedData {
  newMusicList: IMusic[]
  nextMusic: IMusic | null
}
function nextMusicInOrder(musicList: IMusic[], actualIndex: number): IMusic {
  return musicList[actualIndex + 1]
}
function nextMusicInShuffle(
  musicList: IMusic[],
  actualIndex: number
): { nextMusic: IMusic; newMusicList: IMusic[] } {
  const musicsPlayed = musicList.slice(0, actualIndex + 1)
  const musicsNotPlayed = musicList.slice(actualIndex + 1)
  const nextMusicIndex = Math.floor(Math.random() * musicsNotPlayed.length)
  const nextMusic = musicsNotPlayed[nextMusicIndex]
  return {
    newMusicList: [
      ...musicsPlayed,
      nextMusic,
      ...musicsNotPlayed.filter(music => music.id !== nextMusic.id)
    ],
    nextMusic
  }
}
function newMusicArrayInFinalOfPlaylist(
  musicList: IMusic[],
  actualIndex: number
): IMusic[] {
  const actualMusic = musicList[actualIndex]
  return [
    actualMusic,
    ...musicList.filter(music => music.id !== actualMusic.id)
  ]
}
export function nextMusic(data: DataParam): ReturnedData {
  const isLastMusic = data.musicList.length - 1 === data.actualMusicIndex
  if (isLastMusic) {
    if (data.isRepeat) {
      if (data.isShuffle) {
        return nextMusicInShuffle(
          newMusicArrayInFinalOfPlaylist(data.musicList, data.actualMusicIndex),
          0
        )
      } else {
        const newMusicList = newMusicArrayInFinalOfPlaylist(
          data.musicList,
          data.actualMusicIndex
        )
        return {
          newMusicList,
          nextMusic: nextMusicInOrder(newMusicList, 0)
        }
      }
    } else {
      return {
        newMusicList: data.musicList,
        nextMusic: null
      }
    }
  } else {
    if (data.isShuffle) {
      return nextMusicInShuffle(data.musicList, data.actualMusicIndex)
    } else {
      return {
        newMusicList: data.musicList,
        nextMusic: nextMusicInOrder(data.musicList, data.actualMusicIndex)
      }
    }
  }
}
