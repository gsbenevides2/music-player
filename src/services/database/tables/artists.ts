import { ResultSet } from 'expo-sqlite'

import { DatabaseService } from '../databaseService'
import { Table } from '../tableSchema'

export class ArtistsTable extends Table {
  version = 1
  create = [
    'CREATE TABLE IF NOT EXISTS artists (',
    'id TEXT PRIMARY KEY NOT NULL UNIQUE,',
    'name TEXT NOT NULL,',
    'coverUrl TEXT NOT NULL)'
  ]
}

export function useArtistTable(database: DatabaseService) {
  const artistMethods = {
    async getArtist(id: string) {
      const sqlResult = await database.execSQLQuery({
        sql: ['SELECT * FROM artists', 'WHERE id = ?'],
        args: [id]
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const { rows } = sqlResult.result as ResultSet
        const artist = rows[0]
        return artist
      }
    },
    insert(id: string, name: string, coverUrl: string) {
      return database.execSQLQuery({
        sql: ['INSERT INTO artists (id, name, coverUrl)', 'VALUES (?,?,?)'],
        args: [id, name, coverUrl]
      })
    }
  }
  return artistMethods
}
