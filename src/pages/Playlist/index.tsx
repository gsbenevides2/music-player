// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image, DeviceEventEmitter } from 'react-native'
import { Title, Subheading, IconButton } from 'react-native-paper'

import { useRoute, useNavigation } from '@react-navigation/native'

import MusicListDrag from '../../components/MusicListDrag'
import { useDatabase } from '../../services/database'
import { usePlaylistsTable } from '../../services/database/tables/playlists'
import { IMusic } from '../../types'

interface ScreenParams {
  id: number
}

const PlaylistScreen: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { id: playlistId } = route.params as ScreenParams
  const [musics, setMusics] = React.useState<IMusic[]>()
  const database = useDatabase()
  const playlistsTable = usePlaylistsTable(database)

  React.useEffect(() => {
    async function setPlaylistNameHeader() {
      const result = await playlistsTable.get(playlistId)
      const deletePlaylist = async () => {
        await playlistsTable.delete(playlistId)
        navigation.goBack()
        DeviceEventEmitter.emit('update-playlists')
      }
      const RightHeaderButton = () => (
        <IconButton icon="delete" onPress={deletePlaylist} size={25} />
      )
      if (result) {
        navigation.setOptions({
          title: result.name,
          headerRight: RightHeaderButton
        })
      }
    }
    setPlaylistNameHeader()
    async function loadMusics() {
      const musics = await playlistsTable.listMusics(playlistId)
      setMusics(musics)
    }
    loadMusics()
  }, [])
  if (!musics) {
    return <View />
  } else if (!musics.length) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          resizeMode={'contain'}
          style={{ width: '80%', height: '80%' }}
          source={require('../../assets/no_data.png')}
        />
        <Title>Playlist sem músicas</Title>
        <Subheading>Tente colocar músicas nessa playlist</Subheading>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <MusicListDrag
          musics={musics}
          onMusicListChange={() => {}}
          onPress={() => {}}
        />
      </View>
    )
  }
}
export default PlaylistScreen
