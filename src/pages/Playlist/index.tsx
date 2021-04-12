import React from 'react'
import { View, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { IconButton } from 'react-native-paper'

import { useRoute, useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicListDrag from '../../components/MusicListDrag'
import Warning from '../../components/Warning'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { useTimerContext } from '../../contexts/timer'
import { Methods, useMusicOptionsModal } from '../../modals/MusicOptions'
import {
  deleteMusic,
  openPlaylistSelector,
  removeMusicFromPlaylist
} from '../../modals/MusicOptions/hooks'
import { useSelectPlaylistModal } from '../../modals/SelectPlaylist'
import { useDatabase } from '../../services/database'
import { IMusic, IMusicInPlaylist } from '../../types'

interface ScreenParams {
  id: number
}

const PlaylistScreen: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { id: playlistId } = route.params as ScreenParams
  const [musicList, setMusicList] = React.useState<IMusicInPlaylist[]>()
  const database = useDatabase()
  const loadedScreen = useLoadFadedScreen()
  const playerContext = usePlayerContext()
  const playerListenners = getPlayerListenners(playerContext)
  const musicOptions = useMusicOptionsModal()
  const playlistSelectorModal = useSelectPlaylistModal()
  const timer = useTimerContext()

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
      setMusicList as React.Dispatch<
        React.SetStateAction<IMusicInPlaylist[] | IMusic[] | undefined>
      >,
      musicList,
      playerContext,
      playerListenners,
      timer,
      showMessage
    ),
    removeMusicFromPlaylist: removeMusicFromPlaylist(
      database,
      loadedScreen,
      setMusicList,
      musicList,
      showMessage
    )
  }

  const onMoreCallback = React.useCallback(
    async (musicId: string) => {
      const music = musicList?.find(
        music => music.id === musicId
      ) as IMusicInPlaylist
      musicOptions?.open(
        {
          id: music.id,
          name: music.name,
          playlistItemId: music.playlistItemId,
          artist: {
            id: music.artist.id,
            name: music.artist.name
          }
        },
        musicInfoCallbacks
      )
    },
    [...playerListenners, musicList]
  )
  const musicPressCallback = React.useCallback(
    async (musicId: string) => {
      loadedScreen?.open()
      try {
        const musicIndex = musicList?.findIndex(
          music => music.id === musicId
        ) as number
        await playerContext.startPlaylist(
          musicList as IMusicInPlaylist[],
          musicIndex
        )
      } finally {
        loadedScreen?.close()
      }
    },
    [...playerListenners, musicList]
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
        setMusicList(newPlaylist)
        await database.tables.playlist.updatePositions(newPlaylist)
      } finally {
        loadedScreen?.close()
      }
    },
    []
  )

  const deletePlaylist = React.useCallback(async () => {
    loadedScreen?.open()
    try {
      await database.tables.playlist.delete(playlistId)
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
      const result = await database.tables.playlist.get(playlistId)
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
      const musics = await database.tables.playlist.listMusics(playlistId)
      setMusicList(musics)
    }
    loadMusics()
  }, [])
  if (!musicList) {
    return <View />
  } else if (!musicList.length) {
    return (
      <Warning
        imageName="noData"
        title="Playlist Sem Músicas"
        description="Tente colocar músicas nessa playlist."
      />
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <MusicListDrag
          musics={musicList}
          onMusicListChange={musics =>
            handleToUpdatePlaylistMusicPositions(musics as IMusicInPlaylist[])
          }
          onMore={onMoreCallback}
          onPress={musicPressCallback}
        />
      </View>
    )
  }
}
export default PlaylistScreen
