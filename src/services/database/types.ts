/* eslint-disable camelcase */
import {
  Database,
  Query as SQLiteQuery,
  ResultSetError,
  ResultSet
} from 'expo-sqlite'

export interface GetMusicReturns {
  id: number
  name: string
  cover_url: string
  youtube_id?: string
  file_uri?: string
}

export interface Query {
  sql: string[]
  args: unknown[]
}

export interface ExecSQLQueryReturn {
  error?: Error | null | undefined
  result?: (ResultSetError | ResultSet) | undefined
}
export interface ExecSQLQueriesReturn {
  error?: Error | null | undefined
  result?: (ResultSetError | ResultSet)[] | undefined
}

export interface DatabaseServiceImplementation {
  _db: Database
  _parseQuery(query: Query): SQLiteQuery
  _copyForDev(): Promise<void>
  execSQLQuery(query: Query): Promise<ExecSQLQueryReturn>
  execSQLQueries(queries: Query[]): Promise<ExecSQLQueriesReturn>
  enableForeignKeys(): Promise<unknown>
  // _updateDatabase(from:number, to:number):Promise<void>;
  createTables(): Promise<void>
  deleteDb(): Promise<void>
  exportDatabase(): Promise<void>
  importDatabase(): Promise<void>
}
