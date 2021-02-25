import { Sound } from 'expo-av/build/Audio'

import { ContextType } from '../types'

export const playMusic = (playerContext: ContextType) => {
  return async (): Promise<void> => {
    const sound = playerContext?.playerState.sound as Sound
    const status = await sound.getStatusAsync()
    if (status.isLoaded && status.uri) {
      await sound.playAsync()
    }
  }
}
