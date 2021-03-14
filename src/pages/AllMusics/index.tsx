// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Title, Subheading } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicList from '../../components/MusicList'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
import { useSelectPlaylistModal } from '../../modals/SelectPlalist'
import { useDatabase } from '../../services/database'
import { useMusicTable } from '../../services/database/tables/music'
import { usePlaylistsTable } from '../../services/database/tables/playlists'
import { IMusic } from '../../types'

const NoMusic: React.FC = () => (
  <View style={{ alignItems: 'center' }}>
    <Image
      resizeMode={'contain'}
      style={{ width: '80%', height: '80%' }}
      source={require('../../assets/no_data.png')}
    />
    <Title>Sem músicas</Title>
    <Subheading>
      Volte a pagina anterior e clique em "Adicionar Música"
    </Subheading>
  </View>
)

const AllMusicsScreen: React.FC = () => {
  const loadedScreen = useLoadFadedScreen()
  const navigation = useNavigation()
  const [musics, setMusics] = React.useState<IMusic[]>()
  const database = useDatabase()
  const musicTable = useMusicTable(database)
  const plalistTable = usePlaylistsTable(database)
  const plalistSelectorModal = useSelectPlaylistModal()
  const player = usePlayerContext()
  const playerListenners = [musics, ...getPlayerListenners(player)]
  const musicInfo = useMusicInfo()
  const deleteMusic = React.useCallback((musicId: string) => {
    musicInfo.close()
    loadedScreen?.open()
    musicTable
      .delete(musicId)
      .then(() => {
        setMusics(musics?.filter(music => music.id !== musicId))
        player.removeMusicFromMusicList(musicId)
        loadedScreen?.close()
        showMessage({
          type: 'success',
          message: 'Musica deletada'
        })
      })
      .catch(() => {
        showMessage({
          type: 'danger',
          message: 'Ocorreu um erro ao deletar a musica.'
        })
        loadedScreen?.close()
      })
  }, playerListenners)
  const handleToArtist = React.useCallback((artistId: string) => {
    navigation.navigate('Artist', { artistId })
  }, [])
  const musicPressCallback = React.useCallback(async (musicId: string) => {
    loadedScreen?.open()
    try {
      const musicIndex = musics?.findIndex(music => music.id === musicId)
      await player.startPlaylist(musics as IMusic[], musicIndex as number)
    } finally {
      loadedScreen?.close()
    }
  }, playerListenners)
  const onMoreCallback = React.useCallback(async (musicId: string) => {
    const music = musics?.find(music => music.id === musicId) as IMusic
    musicInfo.open({
      id: music.id,
      name: music.name,
      artist: {
        id: music.artist.id,
        name: music.artist.name
      }
    })
  }, playerListenners)
  const openPlaylitsSelector = React.useCallback(async () => {
    musicInfo.close()
    loadedScreen?.open()
    try {
      const playlists = await plalistTable.list()
      loadedScreen?.close()
      const playlistId = await plalistSelectorModal?.(playlists)
      loadedScreen?.open()
      if (!playlistId) return
      await plalistTable.addToPlalist(playlistId, musicInfo.props.data.id)
      showMessage({
        type: 'success',
        message: 'Adicionado com sucesso!'
      })
    } catch (e) {
      showMessage({
        type: 'danger',
        message: 'Erro ao tentar adicionar música a playlist!'
      })
    } finally {
      loadedScreen?.close()
    }
  }, [musicInfo.props.data.id])
  React.useEffect(() => {
    async function load() {
      const musics = await musicTable.list()
      setMusics(musics)
    }
    load()
    const subscription = DeviceEventEmitter.addListener(
      'update-music-list',
      load
    )
    return () => {
      DeviceEventEmitter.removeSubscription(subscription)
    }
  }, [])
  if (musics === undefined) {
    return <View />
  } else if (!musics.length) {
    return <NoMusic />
  } else {
    return (
      <View>
        <MusicList
          onMore={onMoreCallback}
          musics={musics}
          onPress={musicPressCallback}
        />
        <MusicInfo
          {...musicInfo.props}
          methods={{
            deleteMusic,
            handleToArtist,
            addMusicToPlaylist: openPlaylitsSelector
          }}
        />
      </View>
    )
  }
}
export default AllMusicsScreen
