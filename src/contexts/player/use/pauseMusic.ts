import { Sound } from 'expo-av/build/Audio'

import { ContextType } from '../types'

export const pauseMusic = (playerContext: ContextType) => {
  return async (): Promise<void> => {
    const sound = playerContext?.playerState.sound as Sound
    await sound.pauseAsync()
  }
}
