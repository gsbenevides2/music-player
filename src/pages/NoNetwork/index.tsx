import React from 'react'

import NetInfo from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'

import Warning from '../../components/Warning'

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
    <Warning
      imageName="signalSearching"
      title="Sem Internet"
      description="Verifique sua conexão com a internet."
    />
  )
}
