import React from 'react'
import { View, Text } from 'react-native'
import {List} from 'react-native-paper'

import styles from './styles'
import {useNavigation} from '@react-navigation/native'

import UrlInfo, {useUrlInfo} from '../../modals/UrlInfo'

export default function HomeScreen(){
 const navigation = useNavigation()
 const urlInfo = useUrlInfo()

 const handleToAllMusics = React.useCallback(()=>{
 	navigation.navigate('AllMusics')
 },[])
 return (
	<View style={styles.container}>
	 <Text style={styles.title}>Olá, tudo bem?</Text>
	 <List.Item
		onPress={urlInfo.open}
		title='Adicionar Música'
		description='Adicione uma música a sua coleção.'
		left={props=><List.Icon {...props} icon='plus' />}
	 />
	 <List.Item
		title='Ver Todas As Músicas'
		description='Veja todas as músicas'
		onPress={handleToAllMusics}
		left={props=><List.Icon {...props} icon='view-list' />}
	 />
	 <List.Item
		title='Sobre o Aplicativo'
		description='Sobre, Codigo-Aberto, Contato'
		left={props=><List.Icon {...props} icon='information' />}
	 />
	 <UrlInfo
		visible={urlInfo.visible}
		close={urlInfo.close}
	 />
	</View>
 )
}

