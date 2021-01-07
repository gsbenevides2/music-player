import React from 'react'
import {
 ActivityIndicator,
 Portal,
 Modal
} from 'react-native-paper'

interface LoadFadedScreenProps {
 open:boolean
}


export const LoadFadedScreen:React.FC<LoadFadedScreenProps> = ({open})=>(
 <Portal>
	<Modal visible={open} dismissable={false}>
	 <ActivityIndicator size='large'/>
	</Modal>
 </Portal>
)

export function useLoadFadedScreen(){
 const [open,setOpen] = React.useState(false)
 return {
	open:()=>setOpen(true),
	close:()=>setOpen(false),
	props:{open}
 } 
}

