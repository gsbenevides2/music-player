import React from 'react'
import {View, Image, useWindowDimensions, TouchableOpacity} from 'react-native'
import {Title} from 'react-native-paper'

import MusicList from '../../components/MusicList'

import styles from './styles'

export default function HomeScreen(){
 // Calculate Image Width and Height
 const width = useWindowDimensions().width
 const margin = width * 0.1
 const imageWidthAndHeight = (width - (margin*2)) * 0.20

 return (
	<View>
	 <View style={styles.cardArtist}>
		<TouchableOpacity style={styles.artistImage}>
		 <Image
			resizeMode='cover'
			resizeMethod='auto'
			style={{
			 width:imageWidthAndHeight,
				height:imageWidthAndHeight,
				borderRadius:50
			}}
			source={{uri:'https://cdns-images.dzcdn.net/images/artist/4ff81f3d121817ed227c093ef8e777b9/1000x1000-000000-80-0-0.jpg'}}

		/>
	 </TouchableOpacity>
	 <Title>Casting Crowns</Title>
	</View>
	<MusicList/>
 </View>
)
}

