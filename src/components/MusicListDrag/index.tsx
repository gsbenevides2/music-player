// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Image } from 'react-native'
import DraggableFlatList, {
  RenderItemParams
} from 'react-native-draggable-flatlist'
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
  onDrag: () => void
}
const Item: React.FC<ItemProps> = props => {
  const { music } = props
  const onPressCallback = React.useCallback(() => {
    props.onPress(music.id)
  }, [])
  return (
    <List.Item
      title={music.name}
      onPress={onPressCallback}
      description={music.artist.name}
      onLongPress={props.onDrag}
      left={() => <ImageAlbum url={music.coverUrl} />}
    />
  )
}

interface MusicLIstProps {
  musics: Music[]
  onEndReached?: () => void
  onMusicListChange: (musics: Music[]) => void
  onPress: (musicId: string) => void
}

const MemorizedItem = React.memo(Item)
const MusicListDrag: React.FC<MusicLIstProps> = props => {
  return (
    <DraggableFlatList
      data={props.musics}
      renderItem={({ item, drag }) => (
        <MemorizedItem onPress={props.onPress} onDrag={drag} music={item} />
      )}
      keyExtractor={item => item.id}
      onDragEnd={({ data }) => props.onMusicListChange(data)}
    />
  )
}
export default MusicListDrag
