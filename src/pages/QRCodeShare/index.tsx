import React from 'react'
import { useWindowDimensions, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import { useNavigation, useRoute } from '@react-navigation/native'

import { IMusic } from '../../types'
import { useHorizontal } from '../../useHorizontal'
import styles from './styles'

interface IParams {
  music: IMusic
}
export const QRCodeShareScreen: React.FC = () => {
  const { music } = useRoute().params as IParams
  const window = useWindowDimensions()
  const navigation = useNavigation()
  const horizontal = useHorizontal()
  React.useEffect(() => {
    navigation.setOptions({
      title: `QRCode: ${music.name}`
    })
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.whiteBox}>
        <QRCode
          size={horizontal ? window.height - 150 : window.width - 50}
          value={JSON.stringify(music)}
        />
      </View>
    </View>
  )
}
