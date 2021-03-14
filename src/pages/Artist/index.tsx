// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, ImageBackground, Image, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Title, Subheading, IconButton } from 'react-native-paper'

import { useNavigation, useRoute } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicList from '../../components/MusicList'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
import { useSelectPlaylistModal } from '../../modals/SelectPlalist'
import { useDatabase } from '../../services/database'
import { useArtistTable } from '../../services/database/tables/artists'
import { useMusicTable } from '../../services/database/tables/music'
import { usePlaylistsTable } from '../../services/database/tables/playlists'
import { IArtist, IMusic } from '../../types'
import styles from './styles'

interface ScreenParams {
  artistId: string
}
const ArtistScreen: React.FC = () => {
  const loadedScreen = useLoadFadedScreen()
  const [artist, setArtist] = React.useState<IArtist | null>()
  const [musics, setMusics] = React.useState<IMusic[]>()
  const database = useDatabase()
  const artistTable = useArtistTable(database)
  const musicsTable = useMusicTable(database)
  const player = usePlayerContext()
  const route = useRoute()
  const playerListenners = getPlayerListenners(player)
  const navigation = useNavigation()
  const plalistTable = usePlaylistsTable(database)
  const playlistSelectorModal = useSelectPlaylistModal()
  const { artistId } = route.params as ScreenParams

  const musicInfo = useMusicInfo()
  const deleteMusic = React.useCallback(
    async (musicId: string) => {
      musicInfo.close()
      loadedScreen?.open()
      try {
        await musicsTable.delete(musicId)
        setMusics(musics?.filter(music => music.id !== musicId))
        await player.removeMusicFromMusicList(musicId)
        showMessage({
          message: 'Deletado com sucesso',
          type: 'success'
        })
      } catch (e) {
        showMessage({
          message: 'Erro ao deletar',
          type: 'danger'
        })
      } finally {
        loadedScreen?.close()
      }
    },
    [musics, ...playerListenners]
  )

  const onPressMusic = React.useCallback(
    async (musicId: string) => {
      loadedScreen?.open()
      try {
        const index = musics?.findIndex(music => music.id === musicId) as number
        await player.startPlaylist(musics as IMusic[], index)
      } finally {
        loadedScreen?.close()
      }
    },
    [musics, ...playerListenners]
  )
  const onDeleteArtist = React.useCallback(async () => {
    loadedScreen?.open()
    try {
      await artistTable.delete(artistId)
      await player.removeArtistFromMusicList(artistId)
      navigation.goBack()
      DeviceEventEmitter.emit('update-artists')
      DeviceEventEmitter.emit('update-music-list', [artistId])
      showMessage({
        message: 'Deletado com sucesso',
        type: 'success'
      })
    } catch (e) {
      showMessage({
        message: 'Erro ao deletar',
        type: 'danger'
      })
    } finally {
      loadedScreen?.close()
    }
  }, [])
  const onMoreCallback = React.useCallback(
    async (musicId: string) => {
      const music = musics?.find(music => music.id === musicId) as IMusic
      musicInfo.open({
        id: music.id,
        name: music.name,
        artist: {
          id: music.artist.id,
          name: music.artist.name
        }
      })
    },
    [musics]
  )

  const openPlaylitsSelector = React.useCallback(async () => {
    musicInfo.close()
    loadedScreen?.open()
    try {
      const playlists = await plalistTable.list()
      const playlistId = await playlistSelectorModal?.(playlists)
      if (!playlistId) return
      loadedScreen?.open()
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
    async function loadArtistData() {
      const artist = await artistTable.getArtist(artistId)
      setArtist(artist)
      const HeaderRight = () => (
        <IconButton icon="delete" onPress={onDeleteArtist} size={25} />
      )

      if (artist) {
        navigation.setOptions({
          title: artist.name,
          headerRight: HeaderRight
        })
      }
    }
    loadArtistData()
    async function loadMusics() {
      const musics = await musicsTable.getByArtistId(artistId)
      setMusics(musics)
    }
    loadMusics()
    navigation.setOptions({})
  }, [])
  if (!artist) {
    return <View />
  } else if (musics?.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: artist.coverUrl.replace('1000x1000', '800x800') }}
          style={styles.container}
        >
          <View style={{ ...styles.overlay, alignItems: 'center' }}>
            <Image
              resizeMode={'contain'}
              style={{ width: '80%', height: '80%' }}
              source={require('../../assets/no_data.png')}
            />
            <Title>Sem músicas</Title>
            <Subheading>
              Este artista nāo tem músicas em sua biblioteca
            </Subheading>
          </View>
        </ImageBackground>
      </View>
    )
  } else if (musics?.length) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: artist.coverUrl.replace('1000x1000', '800x800') }}
          style={styles.container}
        >
          <View style={styles.overlay}>
            <MusicList
              musics={musics}
              onMore={onMoreCallback}
              onPress={onPressMusic}
            />
          </View>
        </ImageBackground>
        <MusicInfo
          {...musicInfo.props}
          methods={{ deleteMusic, addMusicToPlaylist: openPlaylitsSelector }}
        />
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: artist.coverUrl.replace('1000x1000', '800x800') }}
          style={styles.container}
        >
          <View style={styles.overlay}></View>
        </ImageBackground>
      </View>
    )
  }
}

export default ArtistScreen
