import React from 'react'
import {FlatList} from 'react-native'
import {List} from 'react-native-paper'

import styles from './styles'
import {useNavigation} from '@react-navigation/native'

const PlaylistItem = ()=>{
 const navigation = useNavigation()

 const handleToPlaylistScreen = React.useCallback(()=>{
 	navigation.navigate('Playlist')
 },[])

 return (
	<List.Item
	 onPress={handleToPlaylistScreen}
	 title='Favoritos'
	 description='22 musicas'
	 left={props=><List.Icon {...props} icon='folder'/>}
	/>
 )
}

export default function PlaylistsScreen(){
 const playlists = [
	"oi",
	"tudo",
	"bem",
	"quantos",
	"anos",
	"você",
	"tem?"
 ]
 return (
	<FlatList
	 style={styles.container}
	 data={playlists}
	 keyExtractor={item=>item}
	 renderItem={()=><PlaylistItem/>}
	/>
 )
}

