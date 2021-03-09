// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Portal, Dialog, Button, TextInput } from 'react-native-paper'

interface Props {
  visible: boolean
  close: () => void
  next: (url: string) => void
}
interface UsePlaylistNameReturn {
  visible: boolean
  close: () => void
  open: () => void
}
export const usePlaylistName = (): UsePlaylistNameReturn => {
  const [visible, setVisible] = React.useState(false)
  const close = React.useCallback(() => {
    setVisible(false)
  }, [])
  const open = React.useCallback(() => {
    setVisible(true)
  }, [])
  return { visible, open, close }
}

const PlaylistName: React.FC<Props> = props => {
  const [name, setName] = React.useState('')
  const next = React.useCallback(() => {
    props.next(name)
    props.close()
  }, [name])
  const hideDialog = React.useCallback(() => {
    props.close()
  }, [])

  return (
    <Portal>
      <Dialog visible={props.visible} dismissable={false}>
        <Dialog.Title>Insira o nome da playlist:</Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={name}
            onEndEditing={next}
            onChangeText={text => setName(text)}
            label="Nome da Playlist"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Sair</Button>
          <Button onPress={next}>Criar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default PlaylistName
