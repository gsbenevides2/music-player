export type IContextData = {
 play:false
 musicList:[]
} | {
 play:boolean
 musicList:string[]
 playingActualy:{
	id:number
	title:string
	artist:string
	cover:string
	time:number
	playedTime:number
 }
}
export interface IContext {
 data: IContextData
 setData?: React.Dispatch<React.SetStateAction<IContextData>>
}

export type AsyncStorageData =  {
 musicList:string[]
 playingActualy:{
	id:number
	playedTime:number
 }
}
