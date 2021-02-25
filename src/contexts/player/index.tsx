// eslint-disable-next-line no-use-before-define
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Audio } from 'expo-av'

import { ContextType, PlayerState } from './types'
import { YoutubeService } from '../../services/youtube'

export const PlayerContext = React.createContext<ContextType>(undefined)

export const PlayerProvider: React.FC = ({ children }) => {
  Audio.setAudioModeAsync({
    staysActiveInBackground: true
  })
  const sound = new Audio.Sound()
  const [playerState, setPlayerState] = React.useState<PlayerState>({
    musicList: [],
    sound,
    isShuffle: false,
    isRepeat: false,
    timeDataTo: 0,
    timeDataFrom: 0
  })
  React.useEffect(() => {
    AsyncStorage.getItem('playerContext').then(async value => {
      if (value) {
        const newPlayerState = JSON.parse(value) as PlayerState
        if (newPlayerState.musicActualy) {
          const youtubeService = new YoutubeService()
          const musicUrl = await youtubeService.getMusicPlayUrl(
            newPlayerState.musicActualy.youtubeId
          )
          await sound.loadAsync(
            {
              uri: musicUrl
            },
            {
              positionMillis: newPlayerState.timeDataFrom
            }
          )
          setPlayerState({ ...playerState, sound, ...newPlayerState })
        }
      }
    })
  }, [])
  React.useEffect(() => {
    console.log('OK')
    const serializedPlayerState = { ...playerState, sound: undefined }
    AsyncStorage.setItem('playerContext', JSON.stringify(serializedPlayerState))
  }, [
    playerState.timeDataFrom,
    playerState.timeDataTo,
    playerState.musicList,
    playerState.isRepeat,
    playerState.isRepeat,
    playerState.musicActualy
  ])
  return (
    <PlayerContext.Provider value={{ playerState, setPlayerState }}>
      {children}
    </PlayerContext.Provider>
  )
}
