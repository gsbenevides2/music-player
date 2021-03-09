import {StyleSheet, StatusBar} from "react-native";

export default StyleSheet.create({
 container:{
	marginTop:(StatusBar.currentHeight || 0) + 50
 },
 title:{
	width:'100%',
	textAlign:'center',
	fontSize:55,
	fontWeight:'bold',
	color:'white'
 }
})
