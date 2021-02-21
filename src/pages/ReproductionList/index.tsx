// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View } from 'react-native'

import MusicListDrag from '../../components/MusicListDrag'
import { usePlayerContext } from '../../contexts/player/use'
import { IMusic } from '../../types'

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
  if (player.musicList) {
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
    return <View style={{ flex: 1 }}></View>
  }
}
