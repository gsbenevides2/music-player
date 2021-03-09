/* eslint-disable camelcase */
import axios, { AxiosInstance } from 'axios'

interface DeezerSearchResult {
  data: Array<{
    id: number
    readable: boolean
    title: string
    title_short: string
    title_version: string
    link: string
    duration: number
    rank: number
    explicit_lyrics: boolean
    explicit_content_lyrics: number
    explicit_content_cover: number
    preview: string
    md5_image: string
    artist: {
      id: number
      name: string
      link: string
      picture: string
      picture_small: string
      picture_medium: string
      picture_big: string
      picture_xl: string
      tracklist: string
      type: string
    }
    album: {
      id: number
      title: string
      cover: string
      cover_small: string
      cover_medium: string
      cover_big: string
      cover_xl: string
      md5_image: string
      tracklist: string
      type: string
    }
    type: string
  }>
  total: number
  next?: string
}

export interface IDeezerMusic {
  id: string
  name: string
  artist: {
    id: string
    name: string
    coverUrl: string
  }
  coverUrl: string
}
export interface IDeezerResult {
  musics: IDeezerMusic[]
  next?: number
}
interface DeezerServciceInterface {
  _api: AxiosInstance
  searchMusic(searchQuery: string): Promise<IDeezerResult>
  searchMusicNext(searchQuery: string, next: number): Promise<IDeezerResult>
}

export class DeezerService implements DeezerServciceInterface {
  _api = axios.create({
    baseURL: 'https://api.deezer.com'
  })

  async searchMusic(searchQuery: string): Promise<IDeezerResult> {
    const { data: deezerApiResults } = await this._api.get<DeezerSearchResult>(
      '/search',
      { params: { q: searchQuery } }
    )

    const musics = deezerApiResults.data.map(music => {
      return {
        id: String(music.id),
        name: music.title,
        artist: {
          id: String(music.artist.id),
          name: music.artist.name,
          coverUrl: music.artist.picture_xl
        },
        coverUrl: music.album.cover_xl
      }
    })

    let next
    if (deezerApiResults.next) {
      const re = /index=(\d*)/g
      const result = re.exec(deezerApiResults.next)
      next = result ? parseInt(result[1]) : undefined
    }

    return {
      musics,
      next
    }
  }

  async searchMusicNext(
    searchQuery: string,
    next: number
  ): Promise<IDeezerResult> {
    const { data: deezerApiResults } = await this._api.get<DeezerSearchResult>(
      '/search',
      { params: { q: searchQuery, index: next } }
    )

    const musics = deezerApiResults.data.map(music => {
      return {
        id: String(music.id),
        name: music.title,
        artist: {
          id: String(music.artist.id),
          name: music.artist.name,
          coverUrl: music.artist.picture_big
        },
        coverUrl: music.album.cover_big
      }
    })

    let newNext
    if (deezerApiResults.next) {
      const re = /index=(\d*)/g
      const result = re.exec(deezerApiResults.next)
      newNext = result ? parseInt(result[1]) : undefined
    }

    return {
      musics,
      next: newNext
    }
  }
}
