import React from 'react'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

import styles from './styles'

export interface PlayerOptionsProps {
  openReproductionList: () => void
  openMusicInfo?: () => void
  isShuffle: boolean
  onShuffle: () => void
  isRepeat: boolean
  onRepeat: () => void
}
export const PlayerOptions: React.FC<PlayerOptionsProps> = props => {
  return (
    <View style={styles.optionsArea}>
      <IconButton
        style={{ backgroundColor: props.isShuffle ? 'white' : 'transparent' }}
        onPress={props.onShuffle}
        icon={props.isShuffle ? 'shuffle' : 'shuffle-disabled'}
        color={props.isShuffle ? 'black' : 'white'}
        size={20}
      />
      <IconButton
        style={{ backgroundColor: props.isRepeat ? 'white' : 'transparent' }}
        onPress={props.onRepeat}
        icon={props.isRepeat ? 'repeat' : 'repeat-off'}
        color={props.isRepeat ? 'black' : 'white'}
        size={20}
      />
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
