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
import { useDatabase } from '../../services/database'
import { useMusicTable } from '../../services/database/tables/music'
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
  const player = usePlayerContext()
  const playerListenners = getPlayerListenners(player)
  const musicInfo = useMusicInfo()
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
    const music = (await musicTable.get(musicId)) as IMusic
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
          visible={musicInfo.visible}
          close={musicInfo.close}
          data={musicInfo.data}
          methods={{
            removeFromMusicList,
            deleteMusic,
            handleToArtist
          }}
        />
      </View>
    )
  } else {
    return <NotPlaying />
  }
}
