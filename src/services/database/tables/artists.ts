import {Table} from '../tableSchema'
import {DatabaseService} from '../databaseService'
import {ResultSetError, ResultSet} from 'expo-sqlite'

export class ArtistsTable extends Table{
 version=1
 create=[
	'CREATE TABLE IF NOT EXISTS artists (',
	'id INTEGER PRIMARY KEY NOT NULL UNIQUE,',
	'name TEXT NOT NULL,',
	'cover_url TEXT NOT NULL)'
 ]
}

export function useArtistTable(database:DatabaseService){
 const artistMethods = {
	async getArtist(id:number){
	 const sqlResult = await database.execSQLQuery({
		sql:[
		 'SELECT * FROM artists',
		 'WHERE id = ?'
		],
		args:[id]
	 })
	 if(sqlResult.error){
		throw sqlResult.error
	 }
	 else if(sqlResult.result){
		const { rows } = sqlResult.result as ResultSet
		const artist = rows[0]
		return artist
	 }
	}
	insert(id:number, name:string, cover_url:string){
	 return database.execSQLQuery({
		sql:[
		 'INSERT INTO artists (id, name, cover_url)',
		 'VALUES (?,?,?)'
		],
		args:[id,name,cover_url]
	 })	 
	}
 }
 return artistMethods
}
