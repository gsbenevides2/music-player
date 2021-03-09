import { Sound } from 'expo-av/build/Audio'

import { ContextType } from '../types'

export const clearData = (playerContext: ContextType) => {
  return async (): Promise<void> => {
    const sound = playerContext?.playerState.sound as Sound
    const status = await sound.getStatusAsync()
    if (status.isLoaded && status.isPlaying) {
      await sound.pauseAsync()
      await sound.unloadAsync()
    }
    playerContext?.setPlayerState({
      sound,
      musicList: [],
      musicActualy: undefined,
      timeDataTo: 0,
      timeDataFrom: 0,
      isShuffle: false,
      isRepeat: false
    })
  }
}
