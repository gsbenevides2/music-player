// eslint-disable-next-line no-use-before-define
import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from 'react-native-paper'

import { MaterialCommunityIcons } from '@expo/vector-icons'

interface Props {
  icon: string
  onPress: () => void
  isLarge?: boolean
}
const { defaultStyles, largeStyles } = StyleSheet.create({
  defaultStyles: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.deepPurple500
  },
  largeStyles: {
    width: 70,
    height: 70
  }
})
const PlayerButton: React.FC<Props> = props => {
  const styles = StyleSheet.flatten([
    defaultStyles,
    props.isLarge ? largeStyles : undefined
  ])
  return (
    <TouchableOpacity onPress={props.onPress} style={styles}>
      <MaterialCommunityIcons
        name={props.icon}
        size={props.isLarge ? 48 : 24}
        color="white"
      />
    </TouchableOpacity>
  )
}

export default PlayerButton
