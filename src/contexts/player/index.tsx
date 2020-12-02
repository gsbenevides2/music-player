import React from 'react'
import { IContext, IContextData} from './types'

const initialContext:IContext = {
 data:{
	play:false,
	musicList:[]
 }
}
export const Context = React.createContext<IContext>(initialContext)

export const Provider:React.FC = ({children})=>{
 const [data,setData] = React.useState<IContextData>({
	play:false,
	musicList:[]
 })

 return (
	<Context.Provider value={{data, setData}}>
	 {children}
	</Context.Provider>
 )
}
