import React from 'react'
import { FlatList, Image } from 'react-native'
import { List, IconButton } from 'react-native-paper'

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
      resizeMethod="resize"
      resizeMode="cover"
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
  onMore?: (musciId: string) => void
}
const Item: React.FC<ItemProps> = props => {
  const { music } = props
  const onPressCallback = React.useCallback(() => {
    props.onPress(music.id)
  }, [])
  const onMoreCallback = React.useCallback(() => {
    if (props.onMore) props.onMore(music.id)
  }, [])
  const right = React.useCallback(
    propsIcon => {
      if (props.onMore) {
        return (
          <IconButton
            onPress={onMoreCallback}
            color={propsIcon.color}
            style={{ ...propsIcon.style, marginRight: 24 }}
            icon="dots-vertical"
          />
        )
      } else {
        return undefined
      }
    },
    [props.onMore, onMoreCallback]
  )
  return (
    <List.Item
      title={music.name}
      onPress={onPressCallback}
      description={music.artist.name}
      left={() => <ImageAlbum url={music.coverUrl} />}
      right={right}
    />
  )
}

interface MusicLIstProps {
  musics: Music[]
  onEndReached?: () => void
  onPress: (musicId: string) => void
  onMore?: (musicId: string) => void
}

const MemorizedItem = React.memo(Item)
const MusicList: React.FC<MusicLIstProps> = props => {
  const RenderMusicItem = React.useCallback(
    ({ item }: { item: Music }) => (
      <MemorizedItem
        onMore={props.onMore}
        onPress={props.onPress}
        music={item}
      />
    ),
    []
  )
  return (
    <FlatList
      data={props.musics}
      renderItem={RenderMusicItem}
      keyExtractor={item => item.id}
      onEndReached={props.onEndReached}
      onEndReachedThreshold={0.1}
    />
  )
}
export default MusicList
