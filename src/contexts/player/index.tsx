import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Audio } from 'expo-av'

import { YoutubeService } from '../../services/youtube'
import { ContextType, PlayerState, AsyncStoragePlayerState } from './types'

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
    isRepeat: false
  })
  React.useEffect(() => {
    AsyncStorage.getItem('playerContext')
      .then(async value => {
        const timerData = JSON.parse(
          (await AsyncStorage.getItem('timerContext')) as string
        )
        if (value) {
          const newPlayerState = JSON.parse(value) as AsyncStoragePlayerState
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
                positionMillis: timerData.timeDataFrom
              }
            )
            setPlayerState({
              ...newPlayerState,
              sound
            })
          } else {
            setPlayerState({
              musicList: [],
              sound,
              isShuffle: false,
              isRepeat: false
            })
          }
        }
      })
      .catch(() => {
        setPlayerState({
          musicList: [],
          sound,
          isShuffle: false,
          isRepeat: false
        })
      })
  }, [])
  React.useEffect(() => {
    const serializedPlayerState = { ...playerState, sound: undefined }
    AsyncStorage.setItem('playerContext', JSON.stringify(serializedPlayerState))
  }, [
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
