// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Keyboard } from 'react-native'
import { Portal, Dialog, Button, TextInput } from 'react-native-paper'

interface Props {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  visible: boolean
  close: () => void
  next: (url: string) => void
}
interface UseUrlInfoReturn {
  props: {
    url: string
    setUrl: React.Dispatch<React.SetStateAction<string>>
    visible: boolean
    close: () => void
  }
  clear: () => void
  open: () => void
  close: () => void
}
export const useUrlInfo = (): UseUrlInfoReturn => {
  const [url, setUrl] = React.useState('')
  const [visible, setVisible] = React.useState(false)
  const close = React.useCallback(() => {
    setVisible(false)
  }, [])
  const open = React.useCallback(() => {
    setVisible(true)
  }, [])
  const clear = React.useCallback(() => {
    setUrl('')
  }, [])
  return { props: { url, setUrl, visible, close }, clear, open, close }
}

const UrlInfo: React.FC<Props> = props => {
  return (
    <Portal>
      <Dialog visible={props.visible} dismissable={false}>
        <Dialog.Title>Insira a URL do Youtube</Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={props.url}
            onEndEditing={() => {
              props.next(props.url)
            }}
            onChangeText={text => props.setUrl(text)}
            label="URL do Vídeo"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.close}>Sair</Button>
          <Button
            onPress={() => {
              props.next(props.url)
            }}
          >
            Continuar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default UrlInfo
