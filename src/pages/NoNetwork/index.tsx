import React from 'react'
import { View, Image } from 'react-native'
import { Subheading, Title } from 'react-native-paper'

import NetInfo from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'

export function onNetworkUpdatesInPlayer(): void {
  const navigation = useNavigation()
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isInternetReachable }) => {
      if (!isInternetReachable) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'NoNetworkScreen' }]
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}
export function onNetworkUpdatesInNoNetwork(): void {
  const navigation = useNavigation()
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isInternetReachable }) => {
      if (isInternetReachable) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'tabs' }]
        })
      }
    })
    return () => {
      unsubscribe()
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
