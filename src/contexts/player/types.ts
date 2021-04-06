import React from 'react'

import { Audio } from 'expo-av'

import { IMusic } from '../../types'

export interface PlayerState {
  sound: Audio.Sound
  musicActualy?: IMusic
  musicList: IMusic[]
  isShuffle: boolean
  isRepeat: boolean
}

export interface AsyncStoragePlayerState {
  sound: undefined
  musicActualy?: IMusic
  musicList: IMusic[]
  isShuffle: boolean
  isRepeat: boolean
}
export interface ContextInterface {
  playerState: PlayerState
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>
}

export type ContextType = undefined | ContextInterface

export interface LoadedUsecontext {
  playMusic: () => Promise<void>
  pauseMusic: () => Promise<void>
  playNext: () => Promise<void>
  playPrevious: () => Promise<void>
  startPlaylist: (playlist: IMusic[], position: number) => Promise<void>
  setMusicList: (musics: IMusic[]) => void
  setShuffle: () => void
  setRepeat: () => void
  removeMusicFromMusicList: (musicId: string) => Promise<void>
  removeArtistFromMusicList: (artistId: string) => Promise<void>
  clearData: () => Promise<void>
  addToMusicList: (music: IMusic) => void
  addToNextMusicList: (music: IMusic) => void
  sound?: Audio.Sound
  musicActualy?: IMusic
  musicList?: IMusic[]
  isShuffle?: boolean
  isRepeat?: boolean
}
