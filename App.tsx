// eslint-disable-next-line no-use-before-define
import React from 'react'
import FlashMessage from 'react-native-flash-message'
import { Provider, DarkTheme } from 'react-native-paper'

import { StatusBar } from 'expo-status-bar'

import './src/YellowBox'
import { PlayerProvider } from './src/contexts/player'
import Routes from './src/routes'
import { DatabaseProvider } from './src/services/database'

DarkTheme.colors.accent = DarkTheme.colors.primary

const App: React.FC = () => {
  return (
    <Provider theme={DarkTheme}>
      <PlayerProvider>
        <DatabaseProvider>
          <Routes />
          <StatusBar style="light" />
        </DatabaseProvider>
        <FlashMessage position="top" />
      </PlayerProvider>
    </Provider>
  )
}

export default App
