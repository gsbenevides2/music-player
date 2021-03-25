import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

interface Props {
  musicId?: string
  close: () => void
  onPress?: (musicId: string) => void
}

export const RemoveFromActualMusicListButton: React.FC<Props> = props => {
  if (props.musicId && props.onPress) {
    const onPress = () => {
      props.close()
      props.onPress?.(props.musicId as string)
    }
    return (
      <Button onPress={onPress}>Remover da Lista de Reprodução Atual</Button>
    )
  } else return <React.Fragment />
}
