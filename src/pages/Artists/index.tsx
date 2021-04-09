import React from 'react'
import {
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Image,
  View,
  DeviceEventEmitter,
  RefreshControl
} from 'react-native'
import { Text, Title, Subheading } from 'react-native-paper'

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
          uri: props.data.coverUrl.replace('1000x1000', '500x500')
        }}
      />
      <Text style={styles.artistText}>{props.data.name}</Text>
    </TouchableOpacity>
  )
}
const MemorizedArtist = React.memo(Artist)
const ArtistsScreen: React.FC = () => {
  const [artists, setArtists] = React.useState<IArtist[]>()
  const [loading, setLoading] = React.useState(false)
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
  const load = React.useCallback(async () => {
    setLoading(true)
    const artists = await artistsTable.list()
    setArtists(artists)
    setLoading(false)
  }, [])
  React.useEffect(() => {
    load()
    const subscription = DeviceEventEmitter.addListener('update-artists', load)
    return () => {
      DeviceEventEmitter.removeSubscription(subscription)
    }
  }, [])
  if (artists === undefined) {
    return <View />
  } else if (artists.length === 0) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          resizeMode={'contain'}
          style={{ width: '80%', height: '80%' }}
          source={require('../../assets/no_data.png')}
        />
        <Title>Sem músicas</Title>
        <Subheading>Vá em "Opções" e clique em "Adicionar Música"</Subheading>
      </View>
    )
  } else {
    return (
      <FlatList
        data={artists}
        numColumns={3}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        style={styles.container}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    )
  }
}
export default ArtistsScreen
