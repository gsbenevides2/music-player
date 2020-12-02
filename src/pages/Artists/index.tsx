import React from 'react'
import {
 TouchableOpacity, 
 Image, 
 useWindowDimensions, 
 FlatList
} from 'react-native'
import {Text} from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const Artist = ()=>{
 // Calculate Image Width and Height
 const width = useWindowDimensions().width
 const margin = width * 0.1
 const imageWidthAndHeight = (width - (margin*2)) * 0.35

 const navigation = useNavigation()

 const handleNavigateToArtist = React.useCallback(()=>{
 	navigation.navigate('Artist')
 },[])
 return (
	<TouchableOpacity
	 onPress={handleNavigateToArtist}
	 style={styles.artistContainer}>
	 <Image
		resizeMode='cover'
		resizeMethod='auto'
		style={{
		 width:imageWidthAndHeight,
		 height:imageWidthAndHeight,
			...styles.artistImage
		}}
		source={{uri:'https://cdns-images.dzcdn.net/images/artist/4ff81f3d121817ed227c093ef8e777b9/1000x1000-000000-80-0-0.jpg'}}
	 />
	 <Text style={styles.artistText}>Casting Crowns</Text>
	</TouchableOpacity>
 )
}
export default function ArtistsScreen(){
 const artists = [
	'oi',
	'tudo',
	'bem',
	'como',
	'voce'
 ]
 return (
	<FlatList
	 data={artists}
	 numColumns={3}
	 style={styles.container}
	 keyExtractor={(item)=>item}
	 renderItem={()=><Artist/>}
	/>
 )
}

