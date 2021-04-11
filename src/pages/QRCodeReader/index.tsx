import React from 'react'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { useNavigation } from '@react-navigation/native'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import { Camera } from 'expo-camera'

import Warning from '../../components/Warning'
import { IMusic } from '../../types'
import styles from './styles'

function verifyObject(obj: never, keys: string[]) {
  const result = keys.map(key => key in obj)
  return !result.includes(false)
}

const QRCodeReaderScreen: React.FC = () => {
  const [permission, setPermission] = React.useState<boolean>()
  const navigation = useNavigation()

  const codeScanned = React.useCallback(
    (scanningResult: BarCodeScannerResult) => {
      const { data } = scanningResult
      async function readScannedData(): Promise<IMusic> {
        const json = JSON.parse(data)
        const testResult = verifyObject(json, [
          'id',
          'name',
          'artist',
          'fileUri',
          'coverUrl',
          'youtubeId'
        ])
        if (testResult) return json
        else throw new Error('Invalid')
      }
      readScannedData()
        .then(musicData => {
          navigation.navigate('Music', {
            music: musicData,
            youtubeId: musicData.youtubeId
          })
        })
        .catch(() => {
          showMessage({
            type: 'danger',
            message: 'Erro ao ler o código'
          })
        })
    },
    []
  )

  React.useEffect(() => {
    async function loadPermission() {
      const { status } = await Camera.requestPermissionsAsync()
      setPermission(status === 'granted')
    }
    loadPermission()
  }, [])

  if (permission === undefined) {
    return <View />
  } else if (permission === false) {
    return (
      <Warning
        imageName="noData"
        title="Permisão Negada"
        description="Você me negou o acesso a sua camera."
      />
    )
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.Type.qr]
        }}
        onBarCodeScanned={codeScanned}
      />
    </View>
  )
}
export default QRCodeReaderScreen
