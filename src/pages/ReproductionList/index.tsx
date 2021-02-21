// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'
import { Title, Subheading } from 'react-native-paper'
import MusicListDrag from '../../components/MusicListDrag'
import { usePlayerContext } from '../../contexts/player/use'
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
  const player = usePlayerContext()
  const musicListChange = React.useCallback(
    (musics: IMusic[]) => {
      console.log(musics)
      player.setMusicList(musics)
    },
    [player]
  )
  const musicPressCallback = React.useCallback(
    async (musicId: string) => {
      if (player.musicList) {
        const musicIndex = player.musicList.findIndex(
          music => music.id === musicId
        )
        await player.startPlaylist(player.musicList, musicIndex)
      }
    },
    [player.musicList]
  )
  if (player.musicList && player.musicList.length) {
    return (
      <View style={{ flex: 1 }}>
        <MusicListDrag
          musics={player.musicList}
          onMusicListChange={musics => musicListChange(musics as IMusic[])}
          onPress={musicPressCallback}
        />
      </View>
    )
  } else {
    return <NotPlaying />
  }
}
