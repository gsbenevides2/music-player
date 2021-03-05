// eslint-disable-next-line no-use-before-define
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { List, Portal, Dialog } from 'react-native-paper'

import { IPlaylist } from '../../types'

interface Props {
  visible: boolean
  close: () => void
  next: (id: number) => void
  playlists: IPlaylist[]
}
interface UseSelectPlaylistModalReturn {
  props: {
    visible: boolean
    close: () => void
    playlists: IPlaylist[]
  }
  close: () => void
  open: () => void
  setPlaylists: React.Dispatch<React.SetStateAction<IPlaylist[]>>
}
export function useSelectPlaylistModal(): UseSelectPlaylistModalReturn {
  const [playlists, setPlaylists] = React.useState<IPlaylist[]>([])
  const [visible, setVisible] = React.useState(false)
  const close = React.useCallback(() => {
    setVisible(false)
  }, [])
  const open = React.useCallback(() => {
    setVisible(true)
  }, [])
  return {
    props: {
      close,
      playlists,
      visible
    },
    close,
    open,
    setPlaylists
  }
}

export const SelectPlaylistModal: React.FC<Props> = props => {
  const Item = ({ item }: { item: IPlaylist }) => (
    <List.Item onPress={() => props.next(item.id)} title={item.name} />
  )
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.close}>
        <Dialog.Title>Selecione uma plalist</Dialog.Title>
        <Dialog.Content>
          <FlatList
            data={props.playlists}
            renderItem={Item}
            keyExtractor={item => item.id.toString()}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}
