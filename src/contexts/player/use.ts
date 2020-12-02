import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {Context} from './index'
import {AsyncStorageData} from './types'
import {useDatabase} from '../../services/database'
import {ResultSet} from 'expo-sqlite'

export const useContext = ()=>{
 const context = React.useContext(Context)
 const databaseService = new DatabaseService()

 async function load () {
	const database = useDatabase()
	const data = await AsyncStorage.getItem('@player/context')
	if(data){
	 const parsedData = JSON.parse(data) as AsyncStorageData
	 if(parsedData.musicList && context.setData){
		const musicDb = await databaseService._execSQL([
		 {
			sql:databaseService._createSQLString([
			 'SELECT * FROM musics',
			 'WHERE id = ?'
			]),
			args:[parsedData.playingActualy.id]
		 }
		], false)
		const  = musicDb.result?.[0] as ResultSet
		const music = first_music.rows[0]
		context.setData({
		 play:false,
		 musicList:parsedData.musicList as string[],
		 playingActualy:{
			...parsedData.playingActualy,
			title:'string',
			artist:'string',
			cover:'string',
			time:0
		 }
		})
	 }
	}
 }

 return {
	context,
	load
 }
}
