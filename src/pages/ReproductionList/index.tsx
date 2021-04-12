import React from 'react'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicListDrag from '../../components/MusicListDrag'
import Warning from '../../components/Warning'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { useTimerContext } from '../../contexts/timer'
import { Methods, useMusicOptionsModal } from '../../modals/MusicOptions'
import {
  goToArtists,
  openPlaylistSelector
} from '../../modals/MusicOptions/hooks'
import { useSelectPlaylistModal } from '../../modals/SelectPlaylist'
import { useDatabase } from '../../services/database'
import { IMusic } from '../../types'

export default function ReproductionListScreen(): React.ReactElement {
  const loadedScreen = useLoadFadedScreen()
  const database = useDatabase()
  const navigation = useNavigation()
  const player = usePlayerContext()
  const playerListenners = getPlayerListenners(player)
  const musicOptions = useMusicOptionsModal()
  const playlistSelectorModal = useSelectPlaylistModal()
  const [reproductionList, setReproductionList] = React.useState<IMusic[]>()
  const timer = useTimerContext()

  const deleteMusic = React.useCallback(async (musicId: string) => {
    loadedScreen?.open()
    try {
      await database.tables.music.delete(musicId)
      timer?.set(0, 0)
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
      timer?.set(0, 0)
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
      const music = reproductionList?.find(
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
  if (reproductionList === undefined) {
    return <View />
  } else if (reproductionList.length) {
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
    return (
      <Warning
        imageName="music"
        title="Não Está Tocando Nada"
        description="Tente colocar uma múscia para tocar."
      />
    )
  }
}
