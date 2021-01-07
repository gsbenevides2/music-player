import React from 'react'
import { 
 Portal, 
 Dialog, 
 Button,
 TextInput
} from 'react-native-paper'

interface Props {
 visible:boolean
 close:()=>void
 next:(url:string)=>void
}

export const useUrlInfo = (callback:(url:string)=>void)=>{
 const [visible, setVisible] = React.useState(false)
 const close = React.useCallback(()=>{
	setVisible(false)
 },[])
 const open = React.useCallback(()=>{
	setVisible(true)
 },[])
 const next = React.useCallback((url:string)=>{
	 callback(url)
 },[])
 return {visible, open, close, next}
}

const UrlInfo:React.FC<Props> = (props)=>{
 const [url, setUrl] = React.useState('')
 const next = React.useCallback(()=>{
   props.next(url)
   props.close()
 },[url])
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
			value={url}
			onEndEditing={next}
			onChangeText={text=>setUrl(text)}
			label='URL do Vídeo'
		 />
		</Dialog.Content>
		<Dialog.Actions>
		 <Button onPress={hideDialog}>Sair</Button>
		 <Button onPress={next}>Continuar</Button>
		</Dialog.Actions>
	 </Dialog>
	</Portal>
 )
}

export default UrlInfo
