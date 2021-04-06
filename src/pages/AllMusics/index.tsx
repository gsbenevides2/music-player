import React from 'react'
import { View, Image, DeviceEventEmitter } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Title, Subheading } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicList from '../../components/MusicList'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { Methods, useMusicOptionsModal } from '../../modals/MusicOptions'
import {
  openPlaylistSelector,
  deleteMusic,
  goToArtists
} from '../../modals/MusicOptions/hooks'
import { useSelectPlaylistModal } from '../../modals/SelectPlaylist'
import { useDatabase } from '../../services/database'
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
      {'Volte a pagina anterior e clique em "Adicionar Música"'}
    </Subheading>
  </View>
)

const AllMusicsScreen: React.FC = () => {
  const loadedScreen = useLoadFadedScreen()
  const navigation = useNavigation()
  const [musicList, setMusicList] = React.useState<IMusic[]>()
  const database = useDatabase()
  const playlistSelectorModal = useSelectPlaylistModal()
  const playerContext = usePlayerContext()
  const musicOptions = useMusicOptionsModal()
  const playerListenners = getPlayerListenners(playerContext)
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
    return <NoMusic />
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
