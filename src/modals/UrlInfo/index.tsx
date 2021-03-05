// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Keyboard } from 'react-native'
import { Portal, Dialog, Button, TextInput } from 'react-native-paper'

interface Props {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  visible: boolean
  close: () => void
  next: () => void
}
interface UseUrlInfoReturn {
  props: Props
  clear: () => void
  open: () => void
  close: () => void
}
type UseUrlInfoCallback = (url: string) => void
export const useUrlInfo = (callback: UseUrlInfoCallback): UseUrlInfoReturn => {
  const [url, setUrl] = React.useState('')
  const [visible, setVisible] = React.useState(false)
  const close = React.useCallback(() => {
    setVisible(false)
  }, [])
  const open = React.useCallback(() => {
    setVisible(true)
  }, [])
  const next = React.useCallback(() => {
    callback(url)
    Keyboard.dismiss()
  }, [])
  const clear = React.useCallback(() => {
    setUrl('')
  }, [])
  return { props: { url, setUrl, visible, close, next }, clear, open, close }
}

const UrlInfo: React.FC<Props> = props => {
  return (
    <Portal>
      <Dialog visible={props.visible} dismissable={false}>
        <Dialog.Title>Insira a URL do Youtube</Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={props.url}
            onEndEditing={props.next}
            onChangeText={text => props.setUrl(text)}
            label="URL do Vídeo"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.close}>Sair</Button>
          <Button onPress={props.next}>Continuar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default UrlInfo
