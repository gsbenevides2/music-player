export interface IMusic {
  id: string
  name: string
  coverUrl: string
  youtubeId: string
  fileUri: null | string
  artist: {
    id: string
    name: string
    coverUrl: string
  }
}
