// eslint-disable-next-line no-use-before-define
import React from 'react'
import {
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Image
} from 'react-native'
import { Text } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import { useDatabase } from '../../services/database'
import { useArtistTable } from '../../services/database/tables/artists'
import { IArtist } from '../../types'
import styles from './styles'

interface ArtistProps {
  data: IArtist
  onPress: (artistsId: string) => void
  imageWidthAndHeight: number
}

const Artist: React.FC<ArtistProps> = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress(props.data.id)
      }}
      style={styles.artistContainer}
    >
      <Image
        resizeMethod="resize"
        resizeMode="cover"
        style={{
          width: props.imageWidthAndHeight,
          height: props.imageWidthAndHeight,
          ...styles.artistImage
        }}
        source={{
          uri: props.data.coverUrl
        }}
      />
      <Text style={styles.artistText}>{props.data.name}</Text>
    </TouchableOpacity>
  )
}
const MemorizedArtist = React.memo(Artist)
const ArtistsScreen: React.FC = () => {
  const [artists, setArtists] = React.useState<IArtist[]>([])
  const database = useDatabase()
  const artistsTable = useArtistTable(database)
  const navigation = useNavigation()
  const width = useWindowDimensions().width
  const margin = width * 0.1
  const imageWidthAndHeight = (width - margin * 2) * 0.35

  const handleNavigateToArtist = React.useCallback((artistId: string) => {
    navigation.navigate('Artist', { artistId })
  }, [])
  const renderItem = React.useCallback(
    ({ item }: { item: IArtist }) => (
      <MemorizedArtist
        imageWidthAndHeight={imageWidthAndHeight}
        data={item}
        onPress={handleNavigateToArtist}
      />
    ),
    []
  )
  React.useEffect(() => {
    async function load() {
      const artists = await artistsTable.list()
      setArtists(artists)
    }
    load()
  }, [])
  return (
    <FlatList
      data={artists}
      numColumns={3}
      style={styles.container}
      keyExtractor={item => item.id}
      renderItem={renderItem}
    />
  )
}
export default ArtistsScreen
