// eslint-disable-next-line no-use-before-define
import React from 'react'
import FlashMessage from 'react-native-flash-message'
import { Provider, DarkTheme } from 'react-native-paper'

import { StatusBar } from 'expo-status-bar'

import './src/YellowBox'
import { LoadFadedScreenProvider } from './src/components/LoadFadedScreen'
import { PlayerProvider } from './src/contexts/player'
import { TimerProvider } from './src/contexts/timer'
import { ConfirmModalProvider } from './src/modals/Confirm'
import { InputModalProvider } from './src/modals/Input'
import { SelectPlaylistModalProvider } from './src/modals/SelectPlaylist'
import Routes from './src/routes'
import { DatabaseProvider } from './src/services/database'

DarkTheme.colors.accent = DarkTheme.colors.primary

const App: React.FC = () => {
  return (
    <Provider theme={DarkTheme}>
      <PlayerProvider>
        <TimerProvider>
          <LoadFadedScreenProvider>
            <InputModalProvider>
              <SelectPlaylistModalProvider>
                <ConfirmModalProvider>
                  <DatabaseProvider>
                    <Routes />
                    <StatusBar style="light" />
                  </DatabaseProvider>
                  <FlashMessage position="top" />
                </ConfirmModalProvider>
              </SelectPlaylistModalProvider>
            </InputModalProvider>
          </LoadFadedScreenProvider>
        </TimerProvider>
      </PlayerProvider>
    </Provider>
  )
}

export default App
