import * as SQLite from 'expo-sqlite'

import {
 DatabaseServiceImplementation, 
 ExecSQLQueryReturn, 
 ExecSQLQueriesReturn,
 Query
} from "./types";

import {ArtistsTable} from './tables/artists';
import {MusicsTable} from './tables/music';

export class DatabaseService implements DatabaseServiceImplementation {
 _db = SQLite.openDatabase('data.db')

 _parseQuery(query:Query):SQLite.Query{
	return {
	 args:query.args,
	 sql:query.sql.join(' ')
	}
 }

 async execSQLQuery(query:Query):Promise<ExecSQLQueryReturn>{
	const result = await this.execSQLQueries([query])
	return {
	 error:result.error,
	 result: result.result ? result.result[0] : undefined
	}
 }
 execSQLQueries(queries:Query[]):Promise<ExecSQLQueriesReturn>{
	return new Promise (resolve=>{
	 this._db.exec(queries.map(this._parseQuery), false, (error, result)=>{
		resolve({
		 error,
		 result
		})
	 })
	})
 }
 async enableForeignKeys(){
	await this.execSQLQuery({
	 sql: ['PRAGMA foreign_keys = ON;'],
	 args: []
	})
 }
 async createTables(){
	const artists = new ArtistsTable()
	const musics = new MusicsTable() 
	await this.execSQLQuery(
	 artists.createTable()
	)
	await this.execSQLQuery(
	 musics.createTable()
	)
 }
}
