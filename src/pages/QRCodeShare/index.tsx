import React from 'react'
import QRCode from 'react-native-qrcode-svg'

export const QRCodeShareScreen: React.FC = () => {
  return (
    <View>
      <QRCode value="firebase" />
    </View>
  )
}
