import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

interface Props {
  artistId?: string
  close: () => void
  onPress?: (artistId: string) => void
}

export const GoToArtistButton: React.FC<Props> = props => {
  if (props.artistId && props.onPress) {
    const onPress = () => {
      props.close()
      props.onPress?.(props.artistId as string)
    }
    return <Button onPress={onPress}>Ir para o artista</Button>
  } else return <View />
}
