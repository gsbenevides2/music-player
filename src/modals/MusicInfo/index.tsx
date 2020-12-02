import React from 'react'
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper'

interface Props {
 visible:boolean
 close:()=>void
}

export const useMusicInfo = ()=>{
 const [visible, setVisible] = React.useState(false)
 const close = React.useCallback(()=>{
	setVisible(false)
 },[])
 const open = React.useCallback(()=>{
	setVisible(true)
 },[])
 return {visible, open, close}
}

const MusicInfo:React.FC<Props> = (props)=>{

 const hideDialog = React.useCallback(()=>{
	props.close()
 },[])

 return (
	<Portal>
	 <Dialog visible={props.visible} onDismiss={hideDialog}>
		<Dialog.Title>Informações da Música</Dialog.Title>
		<Dialog.Content>
		 <Paragraph>Nome da Música: Lay me down</Paragraph>
		 <Paragraph>Nome do Artista: Avicii</Paragraph>
		 <Button onPress={hideDialog}>Ver foto de capa</Button>
		 <Button onPress={hideDialog}>Ver artista</Button>
		 <Button onPress={hideDialog}>Baixar</Button>
		 <Button onPress={hideDialog}>Apagar</Button>
		</Dialog.Content>
		<Dialog.Actions>
		 <Button onPress={hideDialog}>Sair</Button>
		</Dialog.Actions>
	 </Dialog>
	</Portal>
 )
}

export default MusicInfo
