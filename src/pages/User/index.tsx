// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { List } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'
import * as WebBrowser from 'expo-web-browser'
import {
  LoadFadedScreen,
  useLoadFadedScreen
} from '../../components/LoadFadedScreen'
import UrlInfo, { useUrlInfo } from '../../modals/UrlInfo'
import { DeezerService } from '../../services/deezer'
import { YoutubeService } from '../../services/youtube'
import styles from './styles'

const UserScreen: React.FC = () => {
  const navigation = useNavigation()
  const youtubeService = new YoutubeService()
  const deezerService = new DeezerService()

  const loadedScreen = useLoadFadedScreen()

  const urlInfo = useUrlInfo(async url => {
    loadedScreen.open()
    try {
      const resultForYoutube = await youtubeService.getVideoIdAndTitle(url)
      const resultForDeezer = await deezerService.searchMusic(
        resultForYoutube.generatedMusicName
      )
      loadedScreen.close()
      navigation.navigate('SelectMusic', { resultForDeezer, resultForYoutube })
    } catch (e) {
      showMessage({
        message: 'Ocorreu um erro, verifique a url',
        type: 'danger'
      })
      loadedScreen.close()
    }
  })

  const handleToAllMusics = React.useCallback(() => {
    navigation.navigate('AllMusics')
  }, [])
  const handleAbout = React.useCallback(() => {
    WebBrowser.openBrowserAsync('https://github.com/gsbenevides2/music-player')
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, tudo bem?</Text>
      <List.Item
        onPress={urlInfo.open}
        title="Adicionar Música"
        description="Adicione uma música a sua coleção."
        left={props => <List.Icon {...props} icon="plus" />}
      />
      <List.Item
        title="Ver Todas As Músicas"
        description="Veja todas as músicas"
        onPress={handleToAllMusics}
        left={props => <List.Icon {...props} icon="view-list" />}
      />
      <List.Item
        onPress={handleAbout}
        title="Sobre o Aplicativo"
        description="Sobre, Codigo-Aberto, Contato"
        left={props => <List.Icon {...props} icon="information" />}
      />
      <UrlInfo
        visible={urlInfo.visible}
        close={urlInfo.close}
        next={urlInfo.next}
      />
      <LoadFadedScreen {...loadedScreen.props} />
    </View>
  )
}
export default UserScreen
