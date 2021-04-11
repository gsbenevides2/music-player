import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import AllMusicsScreen from './pages/AllMusics'
import ArtistScreen from './pages/Artist'
import ArtistsScreen from './pages/Artists'
import MusicScreen from './pages/Music'
import NoNetworkScreen from './pages/NoNetwork'
import OptionsScreen from './pages/Options'
import PlayerScreen from './pages/Player'
import PlaylistScreen from './pages/Playlist'
import PlaylistsScreen from './pages/Playlists'
import QRCodeReaderScreen from './pages/QRCodeReader'
import { QRCodeShareScreen } from './pages/QRCodeShare'
import ReproductionListScreen from './pages/ReproductionList'
import SelectMusicScreen from './pages/SelectMusic'
import SplashScreen from './pages/Splash'
function TabsRoutes() {
  const Tabs = createMaterialBottomTabNavigator()
  return (
    <Tabs.Navigator initialRouteName="Player" shifting>
      <Tabs.Screen
        name="Player"
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="play" size={24} color={color} />
          )
        }}
        component={PlayerScreen}
      />
      <Tabs.Screen
        name="Artists"
        options={{
          title: 'Artistas',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            )
          }
        }}
        component={ArtistsScreen}
      />
      <Tabs.Screen
        name="Options"
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
          title: 'Opções'
        }}
        component={OptionsScreen}
      />
    </Tabs.Navigator>
  )
}

const Routes: React.FC = () => {
  const Stack = createStackNavigator()
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false
          }}
          component={SplashScreen}
        />
        <Stack.Screen
          name="NoNetworkScreen"
          options={{
            headerShown: false
          }}
          component={NoNetworkScreen}
        />
        <Stack.Screen
          name="tabs"
          options={{
            headerShown: false
          }}
          component={TabsRoutes}
        />
        <Stack.Screen
          name="SelectMusic"
          options={{
            title: 'Selecione uma música:'
          }}
          component={SelectMusicScreen}
        />
        <Stack.Screen
          name="AllMusics"
          options={{
            title: 'Todas as Músicas'
          }}
          component={AllMusicsScreen}
        />
        <Stack.Screen
          name="ReproductionList"
          options={{
            title: 'Reproduzindo Agora'
          }}
          component={ReproductionListScreen}
        />
        <Stack.Screen
          name="Artist"
          options={{ title: '' }}
          component={ArtistScreen}
        />
        <Stack.Screen
          name="Music"
          options={{ title: '' }}
          component={MusicScreen}
        />
        <Stack.Screen
          name="Playlists"
          options={{ title: 'Playlists' }}
          component={PlaylistsScreen}
        />
        <Stack.Screen
          name="Playlist"
          options={{ title: '' }}
          component={PlaylistScreen}
        />
        <Stack.Screen
          name="QRCodeShare"
          options={{ title: 'Envie uma música' }}
          component={QRCodeShareScreen}
        />
        <Stack.Screen
          name="QRCodeReader"
          options={{ title: 'Receba uma música' }}
          component={QRCodeReaderScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes
