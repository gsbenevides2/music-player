import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import SplashScreen from './pages/Splash'

import PlayerScreen from './pages/Player'
//import ArtistsScreen from './pages/Artists'
//import PlaylistsScreen from './pages/Playlists'

//import ArtistScreen from './pages/Artist'
//import PlaylistScreen from './pages/Playlist'
import AllMusicsScreen from './pages/AllMusics'
import ReproductionListScreen from './pages/ReproductionList'

import UserScreen from './pages/User'

function TabsRoutes(){
 const Tabs = createMaterialBottomTabNavigator()
 return (
	<Tabs.Navigator initialRouteName='Player' shifting>
	 <Tabs.Screen
		name='Player'
		options={{
		 tabBarIcon:({color})=>{
			return <MaterialCommunityIcons name="play" size={24} color={color} />
		 }
		}}
		component={PlayerScreen}
	 />
	 {/**
	 <Tabs.Screen
		name='Artists'
		options={{
		 tabBarIcon:({color})=>{
			return <MaterialCommunityIcons name="artist" size={24} color={color} />
		 }
		}}
		component={ArtistsScreen}
	 />
	 <Tabs.Screen
		name='Playlists'
		options={{
		 tabBarIcon:({color})=>{
			return <MaterialCommunityIcons name="playlist-music" size={24} color={color} />
		 }
		}}
		component={PlaylistsScreen}
	 />
		 **/}
	 <Tabs.Screen
		name='User'
		options={{
		 tabBarIcon:({color})=>{
			return <MaterialCommunityIcons name="account" size={24} color={color} />
		 }
		}}
		component={UserScreen}
	 />
	</Tabs.Navigator>
 )
}

export default function Routes(){
 const Stack = createStackNavigator()
 return (
	<NavigationContainer theme={DarkTheme}>
	 <Stack.Navigator>
		<Stack.Screen
		 name='splash'
		 options={{
			headerShown:false
		 }}
		 component={SplashScreen}
		/>
		<Stack.Screen
		 name='tabs'
		 options={{
			headerShown:false
		 }}
		 component={TabsRoutes}
		/>
	 {/**
		<Stack.Screen
		 name='Artist'
		 component={ArtistScreen}
		/>
		<Stack.Screen
		 name='Playlist'
		 component={PlaylistScreen}
		/>
		 **/}
		<Stack.Screen
		 name='AllMusics'
		 component={AllMusicsScreen}
		/>
		<Stack.Screen
		 name='ReproductionList'
		 component={ReproductionListScreen}
		/>
	 </Stack.Navigator>
	</NavigationContainer>
 )
}
