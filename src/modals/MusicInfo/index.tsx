/* eslint-disable multiline-ternary */
// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper'

interface MusicData {
  id: string
  name: string
  artist: {
    name: string
    id: string
  }
  playlistItemId?: number
}
interface Methods {
  handleToArtist?: (artistId: string) => void
  removeFromMusicList?: (musicId: string) => void
  addMusicToPlaylist?: (musicId: string) => void
  removeMusicFromPlaylist?: (playlistItemId: number) => void
  deleteMusic: (musicId: string) => void
}
interface Props {
  visible: boolean
  close: () => void
  data: MusicData
  methods: Methods
}
interface useMusicInfoCallback {
  props: {
    visible: boolean
    close: () => void
    data: MusicData
  }
  open: (musicData: MusicData) => void
  close: () => void
}

export const useMusicInfo = (): useMusicInfoCallback => {
  const [visible, setVisible] = React.useState(false)
  const [musicData, setMusicData] = React.useState<MusicData>({
    id: '',
    name: '',
    artist: {
      id: '',
      name: ''
    }
  })
  const close = React.useCallback(() => {
    setVisible(false)
  }, [])
  const open = React.useCallback((musicData: MusicData) => {
    setVisible(true)
    setMusicData(musicData)
  }, [])
  return {
    props: {
      visible,
      close,
      data: musicData
    },
    open,
    close
  }
}

const MusicInfo: React.FC<Props> = props => {
  const hideDialog = React.useCallback(() => {
    props.close()
  }, [])

  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={hideDialog}>
        <Dialog.Title>Informações da Música</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Nome da Música: {props.data.name}</Paragraph>
          <Paragraph>Nome do Artista: {props.data.artist.name}</Paragraph>
          {props.methods.handleToArtist ? (
            <Button
              onPress={() => {
                props.close()
                props.methods.handleToArtist?.(props.data.artist.id)
              }}
            >
              Ver artista
            </Button>
          ) : undefined}
          {props.methods.addMusicToPlaylist ? (
            <Button
              onPress={() => {
                props.close()
                props.methods.addMusicToPlaylist?.(props.data.artist.id)
              }}
            >
              Adicionar a uma playlist
            </Button>
          ) : undefined}
          {props.methods.removeMusicFromPlaylist ? (
            <Button
              onPress={() => {
                props.close()
                props.methods.removeMusicFromPlaylist?.(
                  props.data.playlistItemId as number
                )
              }}
            >
              Remover desta playlist
            </Button>
          ) : undefined}
          {props.methods.removeFromMusicList ? (
            <Button
              onPress={() => props.methods.removeFromMusicList?.(props.data.id)}
            >
              Remover da Reprodução Atual
            </Button>
          ) : undefined}
          <Button onPress={() => props.methods.deleteMusic(props.data.id)}>
            Apagar
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Sair</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default MusicInfo
