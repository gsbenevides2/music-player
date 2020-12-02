import React from 'react'
import { FlatList, Image } from 'react-native'
import { List } from 'react-native-paper'

function ImageAlbum(){
 return (
	<Image
	 style={{
		width:50,
		 height:50,
		 marginRight:16
	 }}
	 source={{uri:'https://e-cdns-images.dzcdn.net/images/cover/e2b36a9fda865cb2e9ed1476b6291a7d/1000x1000-000000-80-0-0.jpg'}}
	/>
	)
}
function Item(){
 return (
	<List.Item 
	 title='Alone'
	 onPress={()=>{}}
	 description='Alan Walker'
	 left={()=><ImageAlbum/>}
	/>
	)
}

export default function MusicList(){
 const musics = "Seu filho da puta!".split(' ')
 return (
	<FlatList 
	 data={musics}
	 renderItem={()=><Item/>}
	 keyExtractor={item=>item}
	/>
	)
}
