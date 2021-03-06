import { ResultSet } from 'expo-sqlite'

import { IMusic } from '../../../types'
import { DatabaseService } from '../databaseService'
import { Table } from '../tableSchema'
import {
  IDatabaseMusicLeftJoinArtists,
  sanitizeDatabaseMusicResult
} from './music'

export class PlaylistsTable extends Table {
  version = 1
  create = [
    'CREATE TABLE IF NOT EXISTS playlists (',
    'id INTEGER PRIMARY KEY AUTOINCREMENT,',
    'name TEXT NOT NULL)'
  ]
}
export class PlaylistsMusicsTable extends Table {
  version = 1
  create = [
    'CREATE TABLE IF NOT EXISTS playlists_musics (',
    'playlistId INTEGER NOT NULL,',
    'musicId TEXT NOT NULL,',
    'FOREIGN KEY(playlistId) REFERENCES playlists(id) ON UPDATE CASCADE ON DELETE CASCADE,',
    'FOREIGN KEY(musicId) REFERENCES musics(id) ON UPDATE CASCADE ON DELETE CASCADE)'
  ]
}
interface IDatabasePlaylists {
  id: number
  name: string
}
interface UsePlalistsReturns {
  get: (id: number) => Promise<IDatabasePlaylists | null>
  create: (name: string) => Promise<number>
  list: () => Promise<IDatabasePlaylists[]>
  delete: (id: number) => Promise<void>
  listMusics(playlistId: number): Promise<IMusic[]>
  addToPlalist(playlistId: number, musicId: string): Promise<void>
}

export function usePlaylistsTable(
  database: DatabaseService
): UsePlalistsReturns {
  return {
    async get(id: number): Promise<IDatabasePlaylists | null> {
      const sqlResult = await database.execSQLQuery({
        sql: ['SELECT * FROM playlists', 'WHERE id = ?'],
        args: [id]
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const { rows } = sqlResult.result as ResultSet
        const music = rows[0] as IDatabasePlaylists
        return music
      } else throw new Error('Erro Desconhecido')
    },
    async delete(id: string): Promise<void> {
      await database.execSQLQuery({
        sql: ['DELETE FROM musics', 'WHERE musics.id = ?'],
        args: [id]
      })
    },
    async create(name) {
      const sqlResult = await database.execSQLQuery({
        sql: ['INSERT INTO playlists (name)', 'VALUES (?)'],
        args: [name]
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const { insertId } = sqlResult.result as ResultSet
        return insertId as number
      } else throw new Error('Erro Desconhecido')
    },
    async list(): Promise<IDatabasePlaylists[]> {
      const sqlResult = await database.execSQLQuery({
        sql: ['SELECT * FROM playlists'],
        args: []
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const resultSet = sqlResult.result as ResultSet
        const rows = resultSet.rows as IDatabasePlaylists[]
        return rows
      } else throw new Error('Erro Desconhecido')
    },
    async delete(id: number): Promise<void> {
      await database.execSQLQuery({
        sql: ['DELETE FROM playlists', 'WHERE id = ?'],
        args: [id]
      })
    },
    async listMusics(playlistId: number): Promise<IMusic[]> {
      const sqlResult = await database.execSQLQuery({
        sql: [
          'SELECT musics.*,',
          'artists.name AS artistName,',
          'artists.coverUrl AS  artistCoverUrl',
          'FROM playlists_musics',
          'LEFT JOIN musics',
          'ON musics.id = playlists_musics.musicId',
          'LEFT JOIN artists',
          'ON musics.artistId = artists.id',
          'WHERE playlistId = ?'
        ],
        args: [playlistId]
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const resultSet = sqlResult.result as ResultSet
        const rows = resultSet.rows as IDatabaseMusicLeftJoinArtists[]
        return rows.map(sanitizeDatabaseMusicResult)
      } else throw new Error('Erro Desconhecido')
    },
    async addToPlalist(playlistId: number, musicId: string): Promise<void> {
      await database.execSQLQuery({
        sql: [
          'INSERT INTO playlists_musics (musicId, playlistId)',
          'VALUES (?,?)'
        ],
        args: [musicId, playlistId]
      })
    }
  }
}
