import React from 'react'
import { View, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicList from '../../components/MusicList'
import Warning from '../../components/Warning'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { useTimerContext } from '../../contexts/timer'
import { Methods, useMusicOptionsModal } from '../../modals/MusicOptions'
import {
  openPlaylistSelector,
  deleteMusic,
  goToArtists
} from '../../modals/MusicOptions/hooks'
import { useSelectPlaylistModal } from '../../modals/SelectPlaylist'
import { useDatabase } from '../../services/database'
import { IMusic } from '../../types'

const AllMusicsScreen: React.FC = () => {
  const loadedScreen = useLoadFadedScreen()
  const navigation = useNavigation()
  const [musicList, setMusicList] = React.useState<IMusic[]>()
  const database = useDatabase()
  const playlistSelectorModal = useSelectPlaylistModal()
  const playerContext = usePlayerContext()
  const musicOptions = useMusicOptionsModal()
  const playerListenners = getPlayerListenners(playerContext)
  const timer = useTimerContext()
  const musicInfoMethods: Methods = {
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
      timer,
      showMessage
    ),
    handleToArtist: goToArtists(navigation)
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
        musicInfoMethods
      )
    },
    [musicList]
  )

  const musicPressCallback = React.useCallback(
    async (musicId: string) => {
      loadedScreen?.open()
      try {
        const musicIndex = musicList?.findIndex(music => music.id === musicId)
        await playerContext.startPlaylist(
          musicList as IMusic[],
          musicIndex as number
        )
      } finally {
        loadedScreen?.close()
      }
    },
    [...playerListenners, musicList]
  )

  React.useEffect(() => {
    async function load() {
      const musics = await database.tables.music.list()
      setMusicList(musics)
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
  if (musicList === undefined) {
    return <View />
  } else if (!musicList.length) {
    return (
      <Warning
        imageName="noData"
        title="Sem Músicas"
        description='Vá em "Opções" e clique em "Adicionar Música".'
      />
    )
  } else {
    return (
      <View>
        <MusicList
          onMore={onMoreCallback}
          musics={musicList}
          onPress={musicPressCallback}
        />
      </View>
    )
  }
}
export default AllMusicsScreen
