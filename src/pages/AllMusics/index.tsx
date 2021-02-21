// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'
import { Title, Subheading } from 'react-native-paper'

import MusicList from '../../components/MusicList'
import { usePlayerContext } from '../../contexts/player/use'
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

  const musicPressCallback = React.useCallback(
    async (musicId: string) => {
      const musicIndex = musics.findIndex(music => music.id === musicId)
      await player.startPlaylist(musics, musicIndex)
    },
    [musics]
  )
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
        <MusicList musics={musics} onPress={musicPressCallback} />
      ) : (
        <NoMusic />
      )}
    </View>
  )
}
export default AllMusicsScreen
