import React from 'react'
import { View, Image, useWindowDimensions } from 'react-native'
import {Text, IconButton} from 'react-native-paper'
import Slider from '@react-native-community/slider'

import PlayerButton from '../../components/PlayerButton'

import styles from './styles'
import {useNavigation} from '@react-navigation/native'

import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'

export default function PlayerScreen(){
 const musicInfo = useMusicInfo()
 const width = useWindowDimensions().width * 0.9
 const navigation = useNavigation()

 const handleToReproductionListScreen = React.useCallback(()=>{
	navigation.navigate('ReproductionList')
 },[])

 return (
	<View style={styles.container}>
	 <Image
		resizeMode="contain"
		style={{width, height:width, marginBottom:20}}
		source={{uri:'https://upload.wikimedia.org/wikipedia/pt/9/9a/Avicii_-_Tim.png'}}
	 />
	 <Text style={styles.musicName}>Lay me down</Text>
	 <Text style={styles.artistName}>Avicii</Text>
	 <View style={styles.playerControlArea}>
		<View style={styles.playerTimeArea}>
		 <Text>00:11</Text>
		 <Text>03:11</Text>
		</View>
		<Slider
		 style={{width:"100%", height: 40}}
		 minimumValue={0}
		 maximumValue={1}
		 thumbTintColor='#123366'
		 minimumTrackTintColor="#123366"
		 maximumTrackTintColor="#ffffff"
		/>
		<View style={styles.optionsArea}>
		 <IconButton
			onPress={()=>{}}
			icon='shuffle'
			color='white'
			size={20}
		 />
		 <IconButton
			onPress={handleToReproductionListScreen}
			icon='format-list-bulleted-square'
			color='white'
			size={20}
		 />
		 <IconButton
			onPress={musicInfo.open}
			icon='information-outline'
			color='white'
			size={20}
		 />
		</View>
		<View style={styles.playerButtonsArea}>
		 <PlayerButton
			onPress={()=>{}}
			icon='skip-previous'
			color='#123366'
		 />
		 <PlayerButton
			onPress={()=>{}}
			icon='play'
			color='#123366'
			isLarge
		 />
		 <PlayerButton
			onPress={()=>{}}
			icon='skip-next'
			color='#123366'
		 />
		</View>
	 </View>
	 <MusicInfo 
		visible={musicInfo.visible} 
		close={musicInfo.close}/>
	</View>
 )
}

