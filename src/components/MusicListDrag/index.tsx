// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Image } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { List, IconButton } from 'react-native-paper'

interface Music {
  id: string
  name: string
  artist: {
    name: string
  }
  coverUrl: string
  playlistItemId?: number
}

interface ImageAlbumProps {
  url: string
}
const ImageAlbum: React.FC<ImageAlbumProps> = ({ url }) => {
  return (
    <Image
      resizeMethod="resize"
      style={{
        width: 50,
        height: 50,
        marginRight: 16
      }}
      source={{ uri: url.replace('1000x1000', '300x300') }}
    />
  )
}

interface ItemProps {
  music: Music
  onPress: (musicId: string) => void
  onDrag: () => void
  onMore?: (musciId: string) => void
}
const Item: React.FC<ItemProps> = props => {
  const { music } = props
  const onPressCallback = React.useCallback(() => {
    props.onPress(music.id)
  }, [props.onPress])
  const onMoreCallback = React.useCallback(() => {
    if (props.onMore) props.onMore(music.id)
  }, [props.onMore])
  return (
    <List.Item
      title={music.name}
      onPress={onPressCallback}
      description={music.artist.name}
      onLongPress={props.onDrag}
      left={() => <ImageAlbum url={music.coverUrl} />}
      right={propsIcon =>
        props.onMore
? (
          <IconButton
            onPress={onMoreCallback}
            color={propsIcon.color}
            style={{ ...propsIcon.style, marginRight: 24 }}
            icon="dots-vertical"
          />
        )
: undefined
      }
    />
  )
}

interface MusicLIstProps {
  musics: Music[]
  onEndReached?: () => void
  onMusicListChange: (musics: Music[]) => void
  onPress: (musicId: string) => void
  onMore?: (musicId: string) => void
}

const MemorizedItem = React.memo(Item)
const MusicListDrag: React.FC<MusicLIstProps> = props => {
  return (
    <DraggableFlatList
      data={props.musics}
      renderItem={({ item, drag }) => (
        <MemorizedItem
          onMore={props.onMore}
          onPress={props.onPress}
          onDrag={drag}
          music={item}
        />
      )}
      keyExtractor={item =>
        item.playlistItemId ? item.playlistItemId.toString() : item.id
      }
      onDragEnd={({ data }) => props.onMusicListChange(data)}
    />
  )
}
export default MusicListDrag
