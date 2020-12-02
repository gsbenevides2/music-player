import { Query } from "./types"

export interface TableImplementation {
 version:number
 create:string[]
 //updates: Array<string[]>
}

export class Table implements TableImplementation{
 version=0
 create=['']
 //updates=[]

 createTable():Query{
	return {
	 sql:this.create,
	 args:[]
	}
 }

 //updateTable(){}
 //_defineTableVersion(version:number){}
}
