// eslint-disable-next-line no-use-before-define
import React from 'react'
import {
  View,
  useWindowDimensions,
  Image,
  DeviceEventEmitter
} from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Title, Paragraph, FAB } from 'react-native-paper'

import { useNavigation, useRoute, StackActions } from '@react-navigation/native'

import { useDatabase } from '../../services/database'
import { useArtistTable } from '../../services/database/tables/artists'
import { useMusicTable } from '../../services/database/tables/music'
import { IDeezerMusic } from '../../services/deezer'
import { useHorizontal } from '../../useHorizontal'
import styles from './styles'
import {
  useLoadFadedScreen,
  LoadFadedScreen
} from '../../components/LoadFadedScreen'

interface ScreenParams {
  music: IDeezerMusic
  youtubeId: string
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function MusicScreen() {
  const horizontal = useHorizontal()
  const width = useWindowDimensions().width * (horizontal ? 0.35 : 0.9)
  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as ScreenParams
  const database = useDatabase()
  const artistTable = useArtistTable(database)
  const musicTable = useMusicTable(database)
  const loadedScreen = useLoadFadedScreen()
  const addMusicToDatabase = React.useCallback(async () => {
    try {
      loadedScreen.open()
      async function checkMusicAlreadyExists(): Promise<void> {
        const music =
          (await musicTable.get(routeParams.music.id)) ||
          (await musicTable.getByYoutubeId(routeParams.youtubeId))
        if (music) {
          throw new Error('Code:01')
        }
      }
      await checkMusicAlreadyExists()
      const artist = await artistTable.getArtist(routeParams.music.artist.id)
      if (!artist) {
        await artistTable.insert(
          routeParams.music.artist.id,
          routeParams.music.artist.name,
          routeParams.music.artist.coverUrl
        )
      }
      await musicTable.insert(
        routeParams.music.id,
        routeParams.music.name,
        routeParams.music.coverUrl,
        routeParams.youtubeId,
        routeParams.music.artist.id
      )
      navigation.dispatch(StackActions.popToTop())
      showMessage({
        message: 'Música adicionada com sucesso',
        type: 'success'
      })
      loadedScreen.close()
      DeviceEventEmitter.emit('update-artists')
    } catch (e) {
      loadedScreen.close()
      if (e.message === 'Code:01') {
        showMessage({
          message: 'Ops essa música ja esta na sua biblioteca',
          type: 'danger'
        })
      } else {
        console.error(e.message)
        showMessage({
          message: 'Erro desconhecido',
          type: 'danger'
        })
      }
    }
  }, [])
  React.useEffect(() => {
    navigation.setOptions({
      title: routeParams.music.name
    })
  }, [])
  return (
    <View
      style={horizontal ? styles.containerHorizontal : styles.containerVerical}
    >
      <Image
        resizeMode="contain"
        style={{ width, height: width, marginBottom: 20 }}
        source={{ uri: routeParams.music.coverUrl }}
      />
      <View style={horizontal ? styles.horizontalInfo : styles.verticalInfo}>
        <Title>{routeParams.music.name}</Title>
        <Paragraph>Nome do Artista: {routeParams.music.artist.name}</Paragraph>
        <Paragraph>ID da Música: {routeParams.music.id}</Paragraph>
        <Paragraph>ID do Artista: {routeParams.music.artist.id}</Paragraph>
        <Paragraph>YouTube Video ID: {routeParams.youtubeId}</Paragraph>
      </View>
      <FAB style={styles.fab} icon="plus" onPress={addMusicToDatabase} />
      <LoadFadedScreen {...loadedScreen.props} />
    </View>
  )
}
