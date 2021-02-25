/* eslint-disable multiline-ternary */
// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper'

interface MusicData {
  id: string
  name: string
  artist: string
}
interface Methods {
  removeFromMusicList?: (musicId: string) => void
  deleteMusic: (musicId: string) => void
}
interface Props {
  visible: boolean
  close: () => void
  data: MusicData
  methods: Methods
}
interface useMusicInfoCallback {
  visible: boolean
  open: (musicData: MusicData) => void
  close: () => void
  data: MusicData
}

export const useMusicInfo = (): useMusicInfoCallback => {
  const [visible, setVisible] = React.useState(false)
  const [musicData, setMusicData] = React.useState<MusicData>({
    id: '',
    name: '',
    artist: ''
  })
  const close = React.useCallback(() => {
    setVisible(false)
  }, [])
  const open = React.useCallback((musicData: MusicData) => {
    setVisible(true)
    setMusicData(musicData)
  }, [])
  return {
    visible,
    open,
    close,
    data: musicData
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
          <Paragraph>Nome do Artista: {props.data.artist}</Paragraph>
          {/*<Button onPress={hideDialog}>Ver foto de capa</Button>
          <Button onPress={hideDialog}>Ver artista</Button>
					<Button onPress={hideDialog}>Baixar</Button>*/}
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
