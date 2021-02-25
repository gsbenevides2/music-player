// eslint-disable-next-line no-use-before-define
import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import AllMusicsScreen from './pages/AllMusics'
import MusicScreen from './pages/Music'
import PlayerScreen from './pages/Player'
import ReproductionListScreen from './pages/ReproductionList'
import SelectMusicScreen from './pages/SelectMusic'
import SplashScreen from './pages/Splash'
import UserScreen from './pages/User'

// import ArtistsScreen from './pages/Artists'
// import PlaylistsScreen from './pages/Playlists'
// import ArtistScreen from './pages/Artist'
// import PlaylistScreen from './pages/Playlist'

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
        name="Options"
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
          title: 'Opções'
        }}
        component={UserScreen}
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
        <Stack.Screen name="Music" component={MusicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes
