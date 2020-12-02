import React from 'react'
import { Image } from 'react-native'
import DraggableFlatList, {RenderItemParams} from 'react-native-draggable-flatlist'
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
interface ItemProps {

}
const Item:React.FC<RenderItemParams<ItemProps>> = (props)=>{
 return (
	<List.Item 
	 title='Alone'
	 onPress={()=>{}}
	 description='Alan Walker'
	 left={()=><ImageAlbum/>}
	 onLongPress={props.drag}
	/>
	)
}

export default function MusicListDrag(){
 const [musics, setMusics] =  React.useState("Seu filho da puta!".split(' '))
 return (
	<DraggableFlatList 
	 data={musics}
	 renderItem={Item}
	 keyExtractor={item=>item}
	 onDragEnd={({data})=>setMusics(data)}
	/>
	)
}
