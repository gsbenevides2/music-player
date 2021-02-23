/* eslint-disable multiline-ternary */
// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'
import { Title, Subheading } from 'react-native-paper'

import MusicList from '../../components/MusicList'
import { usePlayerContext } from '../../contexts/player/use'
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
import { useDatabase } from '../../services/database'
import { useMusicTable } from '../../services/database/tables/music'
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
      Volte a pagina anterior e clique em "Adicionar Música"
    </Subheading>
  </View>
)

const AllMusicsScreen: React.FC = () => {
  const [musics, setMusics] = React.useState<IMusic[]>([])
  const database = useDatabase()
  const musicTable = useMusicTable(database)
  const player = usePlayerContext()
  const musicInfo = useMusicInfo({
    deleteMusic: musicId => {
      musicTable.delete(musicId).then(() => {
        setMusics(musics.filter(music => music.id !== musicId))
        musicInfo.close()
      })
    }
  })
  const musicPressCallback = React.useCallback(
    async (musicId: string) => {
      const musicIndex = musics.findIndex(music => music.id === musicId)
      await player.startPlaylist(musics, musicIndex)
    },
    [musics]
  )
  const onMoreCallback = React.useCallback(async (musicId: string) => {
    const music = (await musicTable.get(musicId)) as IMusic
    console.log(music)
    musicInfo.open({
      id: music.id,
      name: music.name,
      artist: music.artist.name
    })
  }, [])
  React.useEffect(() => {
    async function load() {
      const musics = await musicTable.list()
      setMusics(musics)
    }
    load()
  }, [])
  return (
    <View>
      {musics.length ? (
        <MusicList
          onMore={onMoreCallback}
          musics={musics}
          onPress={musicPressCallback}
        />
      ) : (
        <NoMusic />
      )}
      <MusicInfo
        visible={musicInfo.visible}
        close={musicInfo.close}
        data={musicInfo.data}
        methods={musicInfo.methods}
      />
    </View>
  )
}
export default AllMusicsScreen
