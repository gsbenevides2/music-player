import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import styles from './styles'

export interface TimeTextAreaProps {
  from: string
  to: string
}

export const TimeTextArea: React.FC<TimeTextAreaProps> = props => {
  return (
    <View style={styles.playerTimeArea}>
      <Text>{props.from}</Text>
      <Text>{props.to}</Text>
    </View>
  )
}

export const TimeTextAreaMemorized = React.memo(TimeTextArea)
