// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Title, Subheading, IconButton } from 'react-native-paper'

import { useRoute, useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicListDrag from '../../components/MusicListDrag'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
import { useDatabase } from '../../services/database'
import { useMusicTable } from '../../services/database/tables/music'
import { usePlaylistsTable } from '../../services/database/tables/playlists'
import { IMusicInPlaylist } from '../../types'

interface ScreenParams {
  id: number
}

const PlaylistScreen: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { id: playlistId } = route.params as ScreenParams
  const [musics, setMusics] = React.useState<IMusicInPlaylist[]>()
  const database = useDatabase()
  const playlistsTable = usePlaylistsTable(database)
  const loadedScreen = useLoadFadedScreen()
  const player = usePlayerContext()
  const playerListenners = getPlayerListenners(player)
  const musicInfo = useMusicInfo()
  const musicTable = useMusicTable(database)

  const deleteMusic = React.useCallback(
    async (musicId: string) => {
      musicInfo.close()
      loadedScreen?.open()
      try {
        await musicTable.delete(musicId)
        await player.removeMusicFromMusicList(musicId)
        const newPlaylist = musics
          ?.filter(music => music.id !== musicId)
          .map((music, index) => {
            return {
              ...music,
              position: index
            }
          }) as IMusicInPlaylist[]
        await playlistsTable.updatePositions(newPlaylist)
        setMusics(newPlaylist)
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
    [...playerListenners, musics]
  )
  const handleToArtist = React.useCallback((artistId: string) => {
    navigation.navigate('Artist', { artistId })
  }, [])

  const onMoreCallback = React.useCallback(
    async (musicId: string) => {
      const music = musics?.find(
        music => music.id === musicId
      ) as IMusicInPlaylist
      musicInfo.open({
        id: music.id,
        name: music.name,
        playlistItemId: music.playlistItemId,
        artist: {
          id: music.artist.id,
          name: music.artist.name
        }
      })
    },
    [...playerListenners, musics]
  )
  const musicPressCallback = React.useCallback(
    async (musicId: string) => {
      loadedScreen?.open()
      try {
        const musicIndex = musics?.findIndex(
          music => music.id === musicId
        ) as number
        await player.startPlaylist(musics as IMusicInPlaylist[], musicIndex)
      } finally {
        loadedScreen?.close()
      }
    },
    [...playerListenners, musics]
  )
  const handleToRemoveMusicFromPlaylist = React.useCallback(
    async (playlistItemId: number) => {
      loadedScreen?.open()
      try {
        await playlistsTable.removeFromPlaylist(playlistItemId)
        const newPlaylist = musics
          ?.filter(music => music.playlistItemId !== playlistItemId)
          .map((music, index) => {
            return {
              ...music,
              position: index
            }
          }) as IMusicInPlaylist[]
        await playlistsTable.updatePositions(newPlaylist)
        setMusics(newPlaylist)
        showMessage({
          type: 'success',
          message: 'Música removida da playlist com sucesso!'
        })
      } catch (e) {
        showMessage({
          type: 'danger',
          message: 'Erro ao tentar remover música da playlist!'
        })
      } finally {
        loadedScreen?.close()
      }
    },
    [musics]
  )
  const handleToUpdatePlaylistMusicPositions = React.useCallback(
    async (newPlaylistToReorder: IMusicInPlaylist[]) => {
      loadedScreen?.open()
      try {
        const newPlaylist = newPlaylistToReorder.map((music, index) => {
          return {
            ...music,
            position: index
          }
        }) as IMusicInPlaylist[]
        setMusics(newPlaylist)
        await playlistsTable.updatePositions(newPlaylist)
      } finally {
        loadedScreen?.close()
      }
    },
    []
  )

  const deletePlaylist = React.useCallback(async () => {
    loadedScreen?.open()
    try {
      await playlistsTable.delete(playlistId)
      navigation.goBack()
      DeviceEventEmitter.emit('update-playlists')
      showMessage({
        type: 'success',
        message: 'Playlist deletada com sucesso!'
      })
    } catch (e) {
      showMessage({
        type: 'danger',
        message: 'Erro ao tentar deletar a playlist!'
      })
    } finally {
      loadedScreen?.close()
    }
  }, [])
  React.useEffect(() => {
    async function setPlaylistNameHeader() {
      const result = await playlistsTable.get(playlistId)
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
          onMusicListChange={musics =>
            handleToUpdatePlaylistMusicPositions(musics as IMusicInPlaylist[])
          }
          onMore={onMoreCallback}
          onPress={musicPressCallback}
        />
        <MusicInfo
          {...musicInfo.props}
          methods={{
            deleteMusic,
            handleToArtist,
            removeMusicFromPlaylist: handleToRemoveMusicFromPlaylist
          }}
        />
      </View>
    )
  }
}
export default PlaylistScreen
