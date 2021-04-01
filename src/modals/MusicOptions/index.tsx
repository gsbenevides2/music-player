import React from 'react'
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper'

import { AddToPlaylistButton } from './AddToPlaylistButton'
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
interface ContextState {
  visible: boolean
  data?: MusicData
  methods: Methods
}
interface ContextValue {
  state: ContextState
  setState: React.Dispatch<React.SetStateAction<ContextState>>
}
const Context = React.createContext<ContextValue | undefined>(undefined)

export const MusicOptionsProvider: React.FC = props => {
  const [state, setState] = React.useState<ContextState>({
    visible: false,
    methods: {}
  })
  const close = React.useCallback(() => {
    setState({
      visible: false,
      methods: {}
    })
  }, [])
  return (
    <Context.Provider value={{ state, setState }}>
      {props.children}
      <Portal>
        <Dialog visible={state.visible} onDismiss={close}>
          <Dialog.Title>Informações da Música</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Nome da Música: {state.data?.name}</Paragraph>
            <Paragraph>Nome do Artista: {state.data?.artist.name}</Paragraph>
            <GoToArtistButton
              artistId={state.data?.artist.id}
              close={close}
              onPress={state.methods.handleToArtist}
            />
            <AddToPlaylistButton
              musicId={state.data?.id}
              close={close}
              onPress={state.methods.addMusicToPlaylist}
            />
            <RemoveFromPlaylistButton
              playlistItemId={state.data?.playlistItemId}
              close={close}
              onPress={state.methods.removeMusicFromPlaylist}
            />
            <RemoveFromActualMusicListButton
              musicId={state.data?.id}
              close={close}
              onPress={state.methods.removeFromActualMusicList}
            />
            <DeleteMusicButton
              musicId={state.data?.id}
              close={close}
              onPress={state.methods.deleteMusic}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={close}>Sair</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Context.Provider>
  )
}
interface UseMusicOptionsModal {
  open: (musicData: MusicData, methods: Methods) => void
}

export function useMusicOptionsModal(): UseMusicOptionsModal | undefined {
  const context = React.useContext(Context)
  return context
    ? {
        open(data: MusicData, methods: Methods) {
          context.setState({
            visible: true,
            data,
            methods
          })
        }
      }
    : undefined
}
