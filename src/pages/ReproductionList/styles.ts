import {StyleSheet, StatusBar} from 'react-native'

export default StyleSheet.create({
 container:{
	marginTop: StatusBar.currentHeight || 0 + 10
 },
 artistImage:{
	borderRadius:50
 },
})
