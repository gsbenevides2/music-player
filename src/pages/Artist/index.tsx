import React from 'react'
import { View, ImageBackground, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { IconButton } from 'react-native-paper'

import { useNavigation, useRoute } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicList from '../../components/MusicList'
import Warning from '../../components/Warning'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { Methods, useMusicOptionsModal } from '../../modals/MusicOptions'
import {
  openPlaylistSelector,
  deleteMusic,
  shareInQRCode
} from '../../modals/MusicOptions/hooks'
import { useSelectPlaylistModal } from '../../modals/SelectPlaylist'
import { useDatabase } from '../../services/database'
import { IArtist, IMusic } from '../../types'
import styles from './styles'

interface ScreenParams {
  artistId: string
}

const ArtistScreen: React.FC = () => {
  const loadedScreen = useLoadFadedScreen()
  const [artist, setArtist] = React.useState<IArtist | null>()
  const [musicList, setMusicList] = React.useState<IMusic[]>()
  const database = useDatabase()
  const playerContext = usePlayerContext()
  const route = useRoute()
  const playerListenners = getPlayerListenners(playerContext)
  const navigation = useNavigation()
  const playlistSelectorModal = useSelectPlaylistModal()
  const { artistId } = route.params as ScreenParams
  const musicOptions = useMusicOptionsModal()
  const musicInfoCallbacks: Methods = {
    addMusicToPlaylist: openPlaylistSelector(
      database,
      loadedScreen,
      showMessage,
      playlistSelectorModal
    ),
    deleteMusic: deleteMusic(
      database,
      loadedScreen,
      setMusicList,
      musicList,
      playerContext,
      playerListenners,
      showMessage
    ),
    shareInQRCode: shareInQRCode(database, navigation)
  }
  const onMoreCallback = React.useCallback(
    async (musicId: string) => {
      const music = musicList?.find(music => music.id === musicId) as IMusic
      musicOptions?.open(
        {
          id: music.id,
          name: music.name,
          artist: {
            id: music.artist.id,
            name: music.artist.name
          }
        },
        musicInfoCallbacks
      )
    },
    [musicList]
  )
  const onPressMusic = React.useCallback(
    async (musicId: string) => {
      loadedScreen?.open()
      try {
        const index = musicList?.findIndex(
          music => music.id === musicId
        ) as number
        await playerContext.startPlaylist(musicList as IMusic[], index)
      } finally {
        loadedScreen?.close()
      }
    },
    [musicList, ...playerListenners]
  )
  const onDeleteArtist = React.useCallback(async () => {
    loadedScreen?.open()
    try {
      await database.tables.artist.delete(artistId)
      await playerContext.removeArtistFromMusicList(artistId)
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
  }, playerListenners)

  React.useEffect(() => {
    async function loadArtistData() {
      const artist = await database.tables.artist.getArtist(artistId)
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
      const musics = await database.tables.music.getByArtistId(artistId)
      setMusicList(musics)
    }
    loadMusics()
    navigation.setOptions({})
  }, [])
  if (!artist) {
    return <View />
  } else if (musicList?.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: artist.coverUrl.replace('1000x1000', '800x800') }}
          style={styles.container}
        >
          <Warning
            imageName="noData"
            title="Sem Músicas"
            description="Este artista nāo tem músicas em sua biblioteca."
            overlay
            fullSize
          />
        </ImageBackground>
      </View>
    )
  } else if (musicList?.length) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: artist.coverUrl.replace('1000x1000', '800x800') }}
          style={styles.container}
        >
          <View style={styles.overlay}>
            <MusicList
              musics={musicList}
              onMore={onMoreCallback}
              onPress={onPressMusic}
            />
          </View>
        </ImageBackground>
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
