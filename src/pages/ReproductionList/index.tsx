// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Title, Subheading } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import {
  useLoadFadedScreen,
  LoadFadedScreen
} from '../../components/LoadFadedScreen'
import MusicListDrag from '../../components/MusicListDrag'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
import {
  SelectPlaylistModal,
  useSelectPlaylistModal
} from '../../modals/SelectPlalist'
import { useDatabase } from '../../services/database'
import { useMusicTable } from '../../services/database/tables/music'
import { usePlaylistsTable } from '../../services/database/tables/playlists'
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
  const musicTable = useMusicTable(database)
  const plalistTable = usePlaylistsTable(database)
  const player = usePlayerContext()
  const playerListenners = getPlayerListenners(player)
  const musicInfo = useMusicInfo()
  const plalistSelectorModal = useSelectPlaylistModal()

  const deleteMusic = React.useCallback(async (musicId: string) => {
    musicInfo.close()
    loadedScreen.open()
    try {
      await musicTable.delete(musicId)
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
      loadedScreen.close()
    }
  }, playerListenners)
  const handleToArtist = React.useCallback((artistId: string) => {
    navigation.navigate('Artist', { artistId })
  }, [])
  const removeFromMusicList = React.useCallback(async (musicId: string) => {
    musicInfo.close()
    loadedScreen.open()
    try {
      await player.removeMusicFromMusicList(musicId)
    } finally {
      loadedScreen.close()
    }
  }, playerListenners)
  const onMoreCallback = React.useCallback(async (musicId: string) => {
    const music = player.musicList?.find(
      music => music.id === musicId
    ) as IMusic
    musicInfo.open({
      id: music.id,
      name: music.name,
      artist: {
        id: music.artist.id,
        name: music.artist.name
      }
    })
  }, playerListenners)
  const musicListChange = React.useCallback((musics: IMusic[]) => {
    player.setMusicList(musics)
  }, playerListenners)
  const musicPressCallback = React.useCallback(async (musicId: string) => {
    loadedScreen.open()
    try {
      if (player.musicList) {
        const musicIndex = player.musicList.findIndex(
          music => music.id === musicId
        )
        await player.startPlaylist(player.musicList, musicIndex)
      }
    } finally {
      loadedScreen.close()
    }
  }, playerListenners)
  const openPlaylitsSelector = React.useCallback(async () => {
    musicInfo.close()
    loadedScreen.open()
    try {
      const playlists = await plalistTable.list()
      plalistSelectorModal.setPlaylists(playlists)
      plalistSelectorModal.open()
    } finally {
      loadedScreen.close()
    }
  }, [])
  const addMusicToPlaylist = React.useCallback(
    async (playlistId: number) => {
      loadedScreen.open()
      plalistSelectorModal.close()
      try {
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
        loadedScreen.close()
      }
    },
    [musicInfo.props.data.id]
  )

  if (player.musicList && player.musicList.length) {
    return (
      <View style={{ flex: 1 }}>
        <MusicListDrag
          musics={player.musicList || []}
          onMusicListChange={musics => musicListChange(musics as IMusic[])}
          onPress={musicPressCallback}
          onMore={onMoreCallback}
        />
        <LoadFadedScreen {...loadedScreen.props} />
        <MusicInfo
          {...musicInfo.props}
          methods={{
            removeFromMusicList,
            deleteMusic,
            handleToArtist,
            addMusicToPlaylist: openPlaylitsSelector
          }}
        />
        <SelectPlaylistModal
          {...plalistSelectorModal.props}
          next={addMusicToPlaylist}
        />
      </View>
    )
  } else {
    return <NotPlaying />
  }
}
