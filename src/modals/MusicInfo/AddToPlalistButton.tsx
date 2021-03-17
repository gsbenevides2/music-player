import React from 'react'
import { Button } from 'react-native-paper'

interface Props {
  musicId?: string
  onPress?: (musicId: string) => void
}

export const AddToPlaylist: React.FC<Props> = props => {
  if (props.musicId && props.onPress) {
    const onPress = () => {
      props.onPress?.(props.musicId as string)
    }
    return <Button onPress={onPress}>Adicionar a uma Playlist</Button>
  } else return <React.Fragment />
}
