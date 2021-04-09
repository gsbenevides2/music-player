import { ResultSet } from 'expo-sqlite'

import { IMusicInPlaylist, IPlaylist } from '../../../types'
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
    'id INTEGER PRIMARY KEY AUTOINCREMENT,',
    'playlistId INTEGER NOT NULL,',
    'musicId TEXT NOT NULL,',
    'position INTEGER NOT NULL,',
    'FOREIGN KEY(playlistId) REFERENCES playlists(id) ON UPDATE CASCADE ON DELETE CASCADE,',
    'FOREIGN KEY(musicId) REFERENCES musics(id) ON UPDATE CASCADE ON DELETE CASCADE)'
  ]
}
interface IDatabasePlaylist {
  id: number
  name: string
}
export interface UsePlaylistsReturns {
  get: (id: number) => Promise<IPlaylist | null>
  create: (name: string) => Promise<number>
  list: () => Promise<IPlaylist[]>
  delete: (id: number) => Promise<void>
  listMusics(playlistId: number): Promise<IMusicInPlaylist[]>
  addToPlaylist(playlistId: number, musicId: string): Promise<void>
  removeFromPlaylist(id: number): Promise<void>
  getPlaylistsByMusic(musicId: string): Promise<number[]>
  updatePositions(playlist: IMusicInPlaylist[]): Promise<void>
}
export interface IDatabasePlaylistWithMusic
  extends IDatabaseMusicLeftJoinArtists {
  position: number
  playlistItemId: number
}
export function usePlaylistsTable(
  database: DatabaseService
): UsePlaylistsReturns {
  return {
    async get(id: number): Promise<IPlaylist | null> {
      const sqlResult = await database.execSQLQuery({
        sql: ['SELECT * FROM playlists', 'WHERE id = ?'],
        args: [id]
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const { rows } = sqlResult.result as ResultSet
        const music = rows[0] as IDatabasePlaylist
        return music
      } else throw new Error('Erro Desconhecido')
    },
    async delete(id: number): Promise<void> {
      await database.execSQLQuery({
        sql: ['DELETE FROM playlists', 'WHERE playlists.id = ?'],
        args: [id]
      })
    },
    async create(name: string) {
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
    async list(): Promise<IPlaylist[]> {
      const sqlResult = await database.execSQLQuery({
        sql: ['SELECT * FROM playlists'],
        args: []
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const resultSet = sqlResult.result as ResultSet
        const rows = resultSet.rows as IDatabasePlaylist[]
        return rows
      } else throw new Error('Erro Desconhecido')
    },
    async listMusics(playlistId: number): Promise<IMusicInPlaylist[]> {
      const sqlResult = await database.execSQLQuery({
        sql: [
          'SELECT musics.*,',
          'artists.name AS artistName,',
          'artists.coverUrl AS  artistCoverUrl,',
          'playlists_musics.position,',
          'playlists_musics.id AS playlistItemId',
          'FROM playlists_musics',
          'LEFT JOIN musics',
          'ON musics.id = playlists_musics.musicId',
          'LEFT JOIN artists',
          'ON musics.artistId = artists.id',
          'WHERE playlistId = ?',
          'ORDER BY playlists_musics.position asc'
        ],
        args: [playlistId]
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const resultSet = sqlResult.result as ResultSet
        const rows = resultSet.rows as IDatabasePlaylistWithMusic[]
        return rows.map(sanitizeDatabaseMusicResult).map((music, index) => {
          return {
            ...music,
            position: rows[index].position,
            playlistItemId: rows[index].playlistItemId
          }
        })
      } else throw new Error('Erro Desconhecido')
    },
    async addToPlaylist(playlistId: number, musicId: string): Promise<void> {
      const { length: lastPosition } = await this.listMusics(playlistId)
      await database.execSQLQuery({
        sql: [
          'INSERT INTO playlists_musics (musicId, playlistId, position)',
          'VALUES (?,?,?)'
        ],
        args: [musicId, playlistId, lastPosition]
      })
    },
    async removeFromPlaylist(id: number): Promise<void> {
      await database.execSQLQuery({
        sql: ['DELETE FROM playlists_musics', 'WHERE id = ?'],
        args: [id]
      })
    },
    async getPlaylistsByMusic(musicId: string): Promise<number[]> {
      const sqlResult = await database.execSQLQuery({
        sql: [
          'SELECT playlists_musics.id FROM playlists_musics',
          'WHERE musicId = ?'
        ],
        args: [musicId]
      })
      if (sqlResult.error) {
        throw sqlResult.error
      } else if (sqlResult.result) {
        const resultSet = sqlResult.result as ResultSet
        const rows = (resultSet.rows.map(
          ({ id }): { id: number } => id
        ) as unknown) as number[]
        return rows
      } else throw new Error('Erro Desconhecido')
    },
    async updatePositions(playlists: IMusicInPlaylist[]): Promise<void> {
      await database.execSQLQueries(
        playlists.map(music => {
          return {
            sql: ['UPDATE playlists_musics SET position = ? WHERE id = ?'],
            args: [music.position, music.playlistItemId]
          }
        })
      )
    }
  }
}
