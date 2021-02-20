// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import AppLoading from 'expo-app-loading'
import { useAssets } from 'expo-asset'

import { useDatabase } from '../../services/database'

export default function SplashScreen(): React.ReactNode {
  const navigation = useNavigation()
  const database = useDatabase()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const [assets] = useAssets(require('../../../assets/splash.png'))

  React.useEffect(() => {
    if (assets) {
      ;(async function () {
        await database.enableForeignKeys()
        await database.createTables()
        navigation.reset({
          index: 0,
          routes: [{ name: 'tabs' }]
        })
      })()
    }
  }, [assets])

  if (!assets) {
    return <AppLoading autoHideSplash />
  } else {
    return (
      <View>
        <Image
          style={{
            width: '100%',
            height: '100%'
          }}
          source={require('../../../assets/splash.png')}
          resizeMode="contain"
        />
      </View>
    )
  }
}
