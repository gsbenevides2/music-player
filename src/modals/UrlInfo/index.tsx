import React from 'react'
import { 
 Portal, 
 Dialog, 
 Paragraph, 
 Button,
 TextInput
} from 'react-native-paper'

interface Props {
 visible:boolean
 close:()=>void
}

export const useUrlInfo = ()=>{
 const [visible, setVisible] = React.useState(false)
 const close = React.useCallback(()=>{
	setVisible(false)
 },[])
 const open = React.useCallback(()=>{
	setVisible(true)
 },[])
 return {visible, open, close}
}

const UrlInfo:React.FC<Props> = (props)=>{

 const hideDialog = React.useCallback(()=>{
	props.close()
 },[])

 return (
	<Portal>
	 <Dialog 
		visible={props.visible}
		dismissable={false}>
		<Dialog.Title>Insira a URL do Youtube</Dialog.Title>
		<Dialog.Content>
		 <TextInput
			label='URL do Vídeo'
		 />
		</Dialog.Content>
		<Dialog.Actions>
		 <Button onPress={hideDialog}>Sair</Button>
		 <Button onPress={hideDialog}>Continuar</Button>
		</Dialog.Actions>
	 </Dialog>
	</Portal>
 )
}

export default UrlInfo
