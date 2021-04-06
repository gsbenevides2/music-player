import React from 'react'
import { View, Image } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Title, Subheading } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicListDrag from '../../components/MusicListDrag'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { Methods, useMusicOptionsModal } from '../../modals/MusicOptions'
import {
  goToArtists,
  openPlaylistSelector
} from '../../modals/MusicOptions/hooks'
import { useSelectPlaylistModal } from '../../modals/SelectPlaylist'
import { useDatabase } from '../../services/database'
import { IMusic } from '../../types'

const NotPlaying: React.FC = () => (
  <View style={{ alignItems: 'center' }}>
    <Image
      resizeMode={'contain'}
      style={{ width: '80%', height: '80%' }}
      source={require('../../assets/no_music.png')}
    />
    <Title>Não está tocando nada</Title>
    <Subheading>Tente colocar uma múscia para tocar</Subheading>
  </View>
)
export default function HomeScreen(): React.ReactElement {
  const loadedScreen = useLoadFadedScreen()
  const database = useDatabase()
  const navigation = useNavigation()
  const player = usePlayerContext()
  const playerListenners = getPlayerListenners(player)
  const musicOptions = useMusicOptionsModal()
  const playlistSelectorModal = useSelectPlaylistModal()
  const [reproductionList, setReproductionList] = React.useState<IMusic[]>([])
  const deleteMusic = React.useCallback(async (musicId: string) => {
    loadedScreen?.open()
    try {
      await database.tables.music.delete(musicId)
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
  }, playerListenners)
  const removeFromMusicList = React.useCallback(async (musicId: string) => {
    loadedScreen?.open()
    try {
      await player.removeMusicFromMusicList(musicId)
    } finally {
      loadedScreen?.close()
    }
  }, playerListenners)
  const methods: Methods = {
    deleteMusic,
    removeFromActualMusicList: removeFromMusicList,
    addMusicToPlaylist: openPlaylistSelector(
      database,
      loadedScreen,
      showMessage,
      playlistSelectorModal
    ),
    handleToArtist: goToArtists(navigation)
  }

  const onMoreCallback = React.useCallback(
    (musicId: string) => {
      const music = reproductionList.find(
        music => music.id === musicId
      ) as IMusic
      musicOptions?.open(
        {
          id: music.id,
          name: music.name,
          artist: {
            id: music.artist.id,
            name: music.artist.name
          }
        },
        methods
      )
    },
    [reproductionList]
  )
  const musicListChange = React.useCallback((musics: IMusic[]) => {
    loadedScreen?.open()
    player.setMusicList(musics)
    setTimeout(loadedScreen?.close, 3000)
  }, playerListenners)
  const musicPressCallback = React.useCallback(async (musicId: string) => {
    loadedScreen?.open()
    try {
      if (player.musicList) {
        const musicIndex = player.musicList.findIndex(
          music => music.id === musicId
        )
        await player.startPlaylist(player.musicList, musicIndex)
      }
    } finally {
      loadedScreen?.close()
    }
  }, playerListenners)
  React.useEffect(() => {
    setReproductionList(player.musicList || [])
  }, [player.musicList])
  if (reproductionList.length) {
    return (
      <View style={{ flex: 1 }}>
        <MusicListDrag
          musics={reproductionList}
          onMusicListChange={musics => musicListChange(musics as IMusic[])}
          onPress={musicPressCallback}
          onMore={onMoreCallback}
        />
      </View>
    )
  } else {
    return <NotPlaying />
  }
}
