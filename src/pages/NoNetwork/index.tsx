// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'
import { Subheading, Title } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'
import { getNetworkStateAsync } from 'expo-network'

export function onNetworkUpdatesInPlayer(): void {
  const navigation = useNavigation()
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const { isInternetReachable } = await getNetworkStateAsync()
      if (!isInternetReachable) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'NoNetworkScreen' }]
        })
      }
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])
}
export function onNetworkUpdatesInNoNetwork(): void {
  const navigation = useNavigation()
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const { isInternetReachable } = await getNetworkStateAsync()
      if (isInternetReachable) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'tabs' }]
        })
      }
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])
}

export default function NoNetworkScreen(): React.ReactElement {
  onNetworkUpdatesInNoNetwork()
  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        resizeMode={'contain'}
        style={{ width: '80%', height: '80%' }}
        source={require('../../assets/no_network.png')}
      />
      <Title>Sem internet</Title>
      <Subheading>Verifique sua coneção com a internet</Subheading>
    </View>
  )
}
