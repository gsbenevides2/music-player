/* eslint-disable multiline-ternary */
// eslint-disable-next-line no-use-before-define
import React from 'react'
import {Portal, Dialog, Paragraph, Button} from 'react-native-paper'
import {GoToArtist} from './GoToArtistsButton'

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
	deleteMusic?: (musicId: string) => void
}
interface ContextState {
	musicData?: MusicData
	methods: Methods
	visible: boolean
}
interface ContextType {
	state: ContextState
	setState: React.Dispatch<React.SetStateAction<ContextState>>
}
const Context = React.createContext<ContextType | undefined>(undefined)

export const MusicOptionsModalProvider: React.FC = ({children}) => {
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
		<Context.Provider value={undefined}>
			{children}
			<Portal>
				<Dialog visible={state.visible} onDismiss={close}>
					<Dialog.Title>Informações da Música</Dialog.Title>
					<Dialog.Content>
						<Paragraph>Nome da Música: {state.musicData?.name}</Paragraph>
						<Paragraph>Nome do Artista: {state.musicData?.artist.name}</Paragraph>
						<GoToArtist artistId={state.musicData?.artist.id} onPress={state.methods.handleToArtist} />
						{props.methods.addMusicToPlaylist ? (
							<Button
								onPress={() => {
									props.close()
									props.methods.addMusicToPlaylist?.(state.musicData?..artist.id)
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
									state.musicData?..playlistItemId as number
                  )
                }}
              >
                Remover desta playlist
              </Button>
            ) : undefined}
			{props.methods.removeFromMusicList ? (
					<Button
						onPress={() =>
							props.methods.removeFromMusicList?.(state.musicData?..id)
                }
              >
                Remover da Reprodução Atual
              </Button>
	) : undefined
}
			<Button onPress={() => props.methods.deleteMusic(state.musicData?..id)}>
	Apagar
            </Button>
          </Dialog.Content >
	<Dialog.Actions>
		<Button onPress={hideDialog}>Sair</Button>
	</Dialog.Actions>
        </Dialog >
      </Portal >
    </Context.Provider >
  )
}

export default MusicInfo
