/* eslint-disable multiline-ternary */
// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'
import { Title, Subheading } from 'react-native-paper'

import MusicList from '../../components/MusicList'
import { getPlayerListenners } from '../../contexts/player/listenners'
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
  const playerListenners = [musics, ...getPlayerListenners(player)]
  const musicInfo = useMusicInfo()
  const deleteMusic = React.useCallback((musicId: string) => {
    musicTable.delete(musicId).then(() => {
      setMusics(musics.filter(music => music.id !== musicId))
      player.removeFromMusicList(musicId)
      musicInfo.close()
    })
  }, playerListenners)
  const musicPressCallback = React.useCallback(async (musicId: string) => {
    const musicIndex = musics.findIndex(music => music.id === musicId)
    await player.startPlaylist(musics, musicIndex)
  }, playerListenners)
  const onMoreCallback = React.useCallback(async (musicId: string) => {
    const music = (await musicTable.get(musicId)) as IMusic
    musicInfo.open({
      id: music.id,
      name: music.name,
      artist: music.artist.name
    })
  }, playerListenners)
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
        methods={{ deleteMusic }}
      />
    </View>
  )
}
export default AllMusicsScreen
