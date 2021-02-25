import React from 'react'

import { Audio } from 'expo-av'

import { IMusic } from '../../types'

export interface PlayerState {
  sound: Audio.Sound
  musicActualy?: IMusic
  musicList: IMusic[]
  isShuffle: boolean
  isRepeat: boolean
  timeDataTo: number
  timeDataFrom: number
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
  setTimeData: (to: number, from: number) => void
  removeFromMusicList: (musicId: string) => void
  sound?: Audio.Sound
  musicActualy?: IMusic
  musicList?: IMusic[]
  isShuffle?: boolean
  isRepeat?: boolean
  timeDataTo?: number
  timeDataFrom?: number
}
