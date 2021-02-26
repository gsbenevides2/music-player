export interface IArtist {
  id: string
  name: string
  coverUrl: string
}
export interface IMusic {
  id: string
  name: string
  coverUrl: string
  youtubeId: string
  fileUri: null | string
  artist: IArtist
}
