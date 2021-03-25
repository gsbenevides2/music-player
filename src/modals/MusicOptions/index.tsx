import React from 'react'
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper'

import { AddToPlaylistButton } from './AddToPlalistButton'
import { DeleteMusicButton } from './DeleteMusicButton'
import { GoToArtistButton } from './GoToArtistsButton'
import { RemoveFromActualMusicListButton } from './RemoveFromActualMusicListButton'
import { RemoveFromPlaylistButton } from './RemoveFromPlaylistButton'

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
  addMusicToPlaylist?: (musicId: string) => void
  removeFromActualMusicList?: (musicId: string) => void
  removeMusicFromPlaylist?: (playlistItemId: number) => void
  deleteMusic?: (musicId: string) => void
}
interface Props {
  visible: boolean
  close: () => void
  data: MusicData
  methods: Methods
}

export const MusicOptionsModal: React.FC<Props> = props => {
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.close}>
        <Dialog.Title>Informações da Música</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Nome da Música: {props.data.name}</Paragraph>
          <Paragraph>Nome do Artista: {props.data.artist.name}</Paragraph>
          <GoToArtistButton
            artistId={props.data.artist.id}
            close={props.close}
            onPress={props.methods.handleToArtist}
          />
          <AddToPlaylistButton
            musicId={props.data.id}
            close={props.close}
            onPress={props.methods.addMusicToPlaylist}
          />
          <RemoveFromPlaylistButton
            playlistItemId={props.data.playlistItemId}
            close={props.close}
            onPress={props.methods.removeMusicFromPlaylist}
          />
          <RemoveFromActualMusicListButton
            musicId={props.data.id}
            close={props.close}
            onPress={props.methods.removeFromActualMusicList}
          />
          <DeleteMusicButton
            musicId={props.data.id}
            close={props.close}
            onPress={props.methods.deleteMusic}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.close}>Sair</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

interface UseMusicOptionsModal {
  props: {
    visible: boolean
    close: () => void
    data: MusicData
  }
  open: (musicData: MusicData) => void
  close: () => void
}

export function useMusicOptionsModal(): UseMusicOptionsModal {
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
