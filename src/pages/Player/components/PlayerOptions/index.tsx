// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

import styles from './styles'

export interface PlayerOptionsProps {
  openReproductionList: () => void
  openMusicInfo?: () => void
  shuffle?: () => void
}
export const PlayerOptions: React.FC<PlayerOptionsProps> = props => {
  return (
    <View style={styles.optionsArea}>
      <IconButton onPress={() => {}} icon="shuffle" color="white" size={20} />
      <IconButton
        onPress={props.openReproductionList}
        icon="format-list-bulleted-square"
        color="white"
        size={20}
      />
    </View>
  )
}

export const PlayerOptionsMemorized = React.memo(PlayerOptions)
/*
      <IconButton
        onPress={props.openMusicInfo}
        icon="information-outline"
        color="white"
        size={20}
      />
 */
