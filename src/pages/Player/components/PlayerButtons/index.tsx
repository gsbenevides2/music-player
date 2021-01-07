// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View } from 'react-native'

import PlayerButton from '../../../../components/PlayerButton'
import styles from './styles'

export interface PlayerButtonsProps {
  handlePlayOrPause: () => void
  handlePrevious: () => void
  handleNext: () => void
  isPlaying: boolean
}
export const PlayerButtons: React.FC<PlayerButtonsProps> = props => {
  return (
    <View style={styles.playerButtonsArea}>
      <PlayerButton onPress={props.handlePrevious} icon="skip-previous" />
      <PlayerButton
        onPress={props.handlePlayOrPause}
        icon={props.isPlaying ? 'pause' : 'play'}
        isLarge
      />
      <PlayerButton onPress={props.handleNext} icon="skip-next" />
    </View>
  )
}

export const PlayerButtonsMemorized = React.memo(PlayerButtons)
