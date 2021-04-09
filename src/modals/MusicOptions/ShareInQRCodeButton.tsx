import React from 'react'
import { Button } from 'react-native-paper'

interface Props {
  musicId?: string
  close: () => void
  onPress?: (musicId: string) => void
}

export const ShareInQRCodeButton: React.FC<Props> = props => {
  if (props.musicId && props.onPress) {
    const onPress = () => {
      props.close()
      props.onPress?.(props.musicId as string)
    }
    return <Button onPress={onPress}>Compatilhar com QRCode</Button>
  } else return <React.Fragment />
}
