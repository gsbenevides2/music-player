import React from 'react'
import { FlatList, View, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { List, FAB, IconButton } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import Warning from '../../components/Warning'
import { useInputModal } from '../../modals/Input'
import { useDatabase } from '../../services/database'
import { usePlaylistsTable } from '../../services/database/tables/playlists'

interface Playlist {
  id: number
  name: string
}

interface PlaylistItemProps {
  data: Playlist
  onPress: (id: number) => void
  onDelete: (id: number) => void
}
type PropsIcon = {
  color: string
  style?: {
    marginRight: number
    marginVertical?: number | undefined
  }
}
const PlaylistItem: React.FC<PlaylistItemProps> = props => {
  const { id } = props.data
  function handleDelete() {
    props.onDelete(id)
  }
  function handlePress() {
    props.onPress(id)
  }
  const RightComponent = (iconProps: PropsIcon) => (
    <IconButton
      onPress={handleDelete}
      color={iconProps.color}
      style={{ ...iconProps.style, marginRight: 24 }}
      icon="delete"
    />
  )
  return (
    <List.Item
      onPress={handlePress}
      title={props.data.name}
      left={props => <List.Icon {...props} icon="playlist-music" />}
      right={RightComponent}
    />
  )
}

const PlaylistsScreen: React.FC = () => {
  const [playlists, setPlaylists] = React.useState<Playlist[]>()
  const database = useDatabase()
  const loadedScreen = useLoadFadedScreen()
  const playlistsTable = usePlaylistsTable(database)
  const inputModal = useInputModal()
  const handleToOpenModal = React.useCallback(() => {
    inputModal
      ?.open({
        name: 'Criar uma playlist',
        label: 'Inisira o nome da playlist:'
      })
      .then(async name => {
        loadedScreen?.open()
        try {
          if (!name || !name.length) {
            return showMessage({
              message: 'Digite um nome valido.',
              type: 'danger'
            })
          }
          const id = await playlistsTable.create(name)
          const newPlaylist = { id, name }
          if (playlists) setPlaylists([...playlists, newPlaylist])
          else setPlaylists([newPlaylist])
          showMessage({
            message: 'Playlist criada com sucesso',
            type: 'success'
          })
        } catch (e) {
          showMessage({
            message: 'Ocorreu um erro.',
            type: 'danger'
          })
        } finally {
          loadedScreen?.close()
          inputModal.close()
        }
      })
      .catch(() => {
        showMessage({
          message: 'Ocorreu um erro.',
          type: 'danger'
        })
        loadedScreen?.close()
        inputModal.close()
      })
  }, [playlists])
  const navigation = useNavigation()
  const handleDeletePlaylist = React.useCallback(
    async (id: number) => {
      loadedScreen?.open()
      try {
        await playlistsTable.delete(id)
        setPlaylists(playlists?.filter(playlist => playlist.id !== id))
        showMessage({
          type: 'success',
          message: 'Playlist deletada com sucesso.'
        })
      } catch (e) {
        showMessage({
          type: 'danger',
          message: 'Erro ao deletar playlist.'
        })
      } finally {
        loadedScreen?.close()
      }
    },
    [playlists]
  )

  const handleToPlaylistScreen = React.useCallback((id: number) => {
    navigation.navigate('Playlist', { id })
  }, [])
  React.useEffect(() => {
    async function load() {
      const playlists = await playlistsTable.list()
      setPlaylists(playlists)
    }
    load()
    const subscription = DeviceEventEmitter.addListener(
      'update-playlists',
      load
    )
    return () => {
      DeviceEventEmitter.removeSubscription(subscription)
    }
  }, [])
  const RenderItem = React.useCallback(
    ({ item }: { item: Playlist }) => (
      <PlaylistItem
        data={item}
        onDelete={handleDeletePlaylist}
        onPress={handleToPlaylistScreen}
      />
    ),
    [handleDeletePlaylist]
  )
  if (playlists === undefined) {
    return <View />
  } else if (playlists.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <Warning
          imageName="noData"
          title="Sem Playlists"
          description="Clique no + e crie uma!"
        />
        <FAB
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0
          }}
          icon="plus"
          onPress={handleToOpenModal}
        />
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={playlists}
          keyExtractor={item => item.id.toString()}
          renderItem={RenderItem}
        />
        <FAB
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0
          }}
          icon="plus"
          onPress={handleToOpenModal}
        />
      </View>
    )
  }
}
export default PlaylistsScreen
