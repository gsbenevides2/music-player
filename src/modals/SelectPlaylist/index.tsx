// eslint-disable-next-line no-use-before-define
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { List, Portal, Dialog } from 'react-native-paper'

import { IPlaylist } from '../../types'

interface ContextState {
  visible: boolean
  next?: (id: number) => void
  playlists: IPlaylist[]
}

interface ContextType {
  state: ContextState
  setState: React.Dispatch<React.SetStateAction<ContextState>>
}

const Context = React.createContext<ContextType | undefined>(undefined)

export const SelectPlaylistModalProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<ContextState>({
    visible: false,
    playlists: []
  })
  const close = React.useCallback(() => {
    setState({
      visible: false,
      playlists: []
    })
  }, [])
  const next = React.useCallback(
    (id: number) => {
      state.next?.(id)
      close()
    },
    [state.next]
  )
  const Item = ({ item }: { item: IPlaylist }) => (
    <List.Item onPress={() => next(item.id)} title={item.name} />
  )
  return (
    <Context.Provider value={{ state, setState }}>
      {children}
      <Portal>
        <Dialog visible={state.visible} onDismiss={close}>
          <Dialog.Title>Selecione uma playlist</Dialog.Title>
          <Dialog.Content>
            <FlatList
              data={state.playlists}
              renderItem={Item}
              keyExtractor={item => item.id.toString()}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Context.Provider>
  )
}

type UseSelectPlaylistModalReturn = (playlists: IPlaylist[]) => Promise<number>

export function useSelectPlaylistModal():
  | UseSelectPlaylistModalReturn
  | undefined {
  const context = React.useContext(Context)

  if (context) {
    return playlists => {
      return new Promise(resolve => {
        context.setState({
          playlists,
          visible: true,
          next: id => {
            resolve(id)
          }
        })
      })
    }
  }
}
