// eslint-disable-next-line no-use-before-define
import React, { useCallback } from 'react'
import { FlatList, Image } from 'react-native'
import { List } from 'react-native-paper'

interface Music {
  id: string
  name: string
  artist: {
    name: string
  }
  coverUrl: string
}

interface ImageAlbumProps {
  url: string
}
const ImageAlbum: React.FC<ImageAlbumProps> = ({ url }) => {
  return (
    <Image
      style={{
        width: 50,
        height: 50,
        marginRight: 16
      }}
      source={{ uri: url }}
    />
  )
}

interface ItemProps {
  music: Music
  onPress: (musicId: string) => void
}
const Item: React.FC<ItemProps> = props => {
  const { music } = props
  const onPressCallback = useCallback(() => {
    props.onPress(music.id)
  }, [])
  return (
    <List.Item
      title={music.name}
      onPress={onPressCallback}
      description={music.artist.name}
      left={() => <ImageAlbum url={music.coverUrl} />}
    />
  )
}

interface MusicLIstProps {
  musics: Music[]
  onEndReached?: () => void
  onPress: (musicId: string) => void
}

const MemorizedItem = React.memo(Item)
const MusicList: React.FC<MusicLIstProps> = props => {
  return (
    <FlatList
      data={props.musics}
      renderItem={({ item }) => (
        <MemorizedItem onPress={props.onPress} music={item} />
      )}
      keyExtractor={item => item.id}
      onEndReached={props.onEndReached}
      onEndReachedThreshold={0.1}
    />
  )
}
export default MusicList
