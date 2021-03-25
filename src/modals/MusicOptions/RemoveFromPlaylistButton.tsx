import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

interface Props {
  playlistItemId?: number
  close: () => void
  onPress?: (playlistItemId: number) => void
}

export const RemoveFromPlaylistButton: React.FC<Props> = props => {
  if (props.playlistItemId && props.onPress) {
    const onPress = () => {
      props.close()
      props.onPress?.(props.playlistItemId as number)
    }
    return <Button onPress={onPress}>Remover desta playlist</Button>
  } else return <React.Fragment />
}
