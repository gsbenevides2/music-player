// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, ImageBackground } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import MusicList from '../../components/MusicList'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
import { useDatabase } from '../../services/database'
import { useArtistTable } from '../../services/database/tables/artists'
import { useMusicTable } from '../../services/database/tables/music'
import { IArtist, IMusic } from '../../types'
import styles from './styles'

interface ScreenParams {
  artistId: string
}
const ArtistScreen: React.FC = () => {
  const [artist, setArtist] = React.useState<IArtist | null>()
  const [musics, setMusics] = React.useState<IMusic[]>([])
  const database = useDatabase()
  const artistTable = useArtistTable(database)
  const musicsTable = useMusicTable(database)
  const player = usePlayerContext()
  const route = useRoute()
  const playerListenners = getPlayerListenners(player)
  const navigation = useNavigation()
  const { artistId } = route.params as ScreenParams

  const musicInfo = useMusicInfo()
  const deleteMusic = React.useCallback(
    (musicId: string) => {
      musicsTable.delete(musicId).then(() => {
        setMusics(musics.filter(music => music.id !== musicId))
        player.removeFromMusicList(musicId)
        musicInfo.close()
      })
    },
    [musics, ...playerListenners]
  )

  const onPressMusic = React.useCallback(
    (musicId: string) => {
      const index = musics.findIndex(music => music.id === musicId)
      player.startPlaylist(musics, index)
    },
    [musics, ...playerListenners]
  )
  const onMoreCallback = React.useCallback(
    async (musicId: string) => {
      const music = musics.find(music => music.id === musicId) as IMusic
      musicInfo.open({
        id: music.id,
        name: music.name,
        artist: music.artist.name
      })
    },
    [musics]
  )

  React.useEffect(() => {
    async function loadArtistData() {
      const artist = await artistTable.getArtist(artistId)
      setArtist(artist)
      if (artist) navigation.setOptions({ title: artist.name })
    }
    loadArtistData()
    async function loadMusics() {
      const musics = await musicsTable.getByArtistId(artistId)
      setMusics(musics)
    }
    loadMusics()
  }, [])
  if (!artist) {
    return <View />
  } else {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: artist.coverUrl }}
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
          visible={musicInfo.visible}
          close={musicInfo.close}
          data={musicInfo.data}
          methods={{ deleteMusic }}
        />
      </View>
    )
  }
}

export default ArtistScreen
