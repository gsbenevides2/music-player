import React from 'react'
import { Button } from 'react-native-paper'

interface Props {
  artistId?: string
  onPress?: (artistId: string) => void
}

export const GoToArtist: React.FC<Props> = props => {
  if (props.artistId && props.onPress) {
    const onPress = () => {
      props.onPress?.(props.artistId as string)
    }
    return <Button onPress={onPress}>Ir para o artista</Button>
  } else return <React.Fragment />
}
