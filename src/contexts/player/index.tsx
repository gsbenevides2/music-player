// eslint-disable-next-line no-use-before-define
import React from 'react'

import { Audio } from 'expo-av'

import { ContextType, PlayerState } from './types'

export const PlayerContext = React.createContext<ContextType>(undefined)

export const PlayerProvider: React.FC = ({ children }) => {
  Audio.setAudioModeAsync({
    staysActiveInBackground: true
  })
  const sound = new Audio.Sound()
  const [playerState, setPlayerState] = React.useState<PlayerState>({
    musicList: [],
    sound
  })
  return (
    <PlayerContext.Provider value={{ playerState, setPlayerState }}>
      {children}
    </PlayerContext.Provider>
  )
}
