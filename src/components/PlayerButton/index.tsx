import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

interface Props {
 icon: string
 color:string
 onPress:()=>void;
 isLarge?:boolean
}
const {defaultStyles, largeStyles} = StyleSheet.create({
 defaultStyles:{
	width:50,
	height:50,
	borderRadius:50,
	alignItems:'center',
	justifyContent:'center'
 },
 largeStyles:{
	width:70,
	height:70
 }
})
const PlayerButton:React.FC<Props> = (props)=>{
 const styles = StyleSheet.flatten([
	defaultStyles,
	props.isLarge ? largeStyles : undefined,
	{ backgroundColor: props.color}
 ])
 return (
	<TouchableOpacity style={styles}>
	 <MaterialCommunityIcons name={props.icon} size={props.isLarge ? 48 : 24 } color='white' />
	</TouchableOpacity>
 )
}

export default PlayerButton
