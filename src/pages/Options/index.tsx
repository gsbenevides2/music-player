// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Text, ScrollView, Keyboard } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { List } from 'react-native-paper'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import * as WebBrowser from 'expo-web-browser'

import {
  LoadFadedScreen,
  useLoadFadedScreen
} from '../../components/LoadFadedScreen'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import UrlInfo, { useUrlInfo } from '../../modals/UrlInfo'
import { useDatabase } from '../../services/database'
import { DeezerService } from '../../services/deezer'
import { YoutubeService } from '../../services/youtube'
import styles from './styles'

const OptionsScreen: React.FC = () => {
  const navigation = useNavigation()
  const youtubeService = new YoutubeService()
  const deezerService = new DeezerService()
  const database = useDatabase()
  const loadedScreen = useLoadFadedScreen()
  const player = usePlayerContext()
  const playerListenners = getPlayerListenners(player)
  const urlInfo = useUrlInfo()
  const handleUrlInfo = React.useCallback(
    async (url: string) => {
      Keyboard.dismiss()
      loadedScreen.open()
      try {
        const resultForYoutube = await youtubeService.getVideoIdAndTitle(url)
        const resultForDeezer = await deezerService.searchMusic(
          resultForYoutube.generatedMusicName
        )
        loadedScreen.close()
        navigation.navigate('SelectMusic', {
          resultForDeezer,
          resultForYoutube
        })
        urlInfo.close()
        urlInfo.clear()
      } catch (e) {
        showMessage({
          message: 'Ocorreu um erro, verifique a url',
          type: 'danger'
        })
        loadedScreen.close()
      }
    },
    [urlInfo.props.url]
  )

  const handleToAllMusics = React.useCallback(() => {
    navigation.navigate('AllMusics')
  }, [])
  const handleToPlaylists = React.useCallback(() => {
    navigation.navigate('Playlists')
  }, [])
  const handleToResetApp = React.useCallback(async () => {
    await player.clearData()
    await database.deleteDb()
    await AsyncStorage.clear()

    navigation.reset({
      index: 0,
      routes: [{ name: 'splash' }]
    })
  }, playerListenners)
  const handleAbout = React.useCallback(() => {
    WebBrowser.openBrowserAsync('https://github.com/gsbenevides2/music-player')
  }, [])
  const handleToImport = React.useCallback(async () => {
    try {
      await database.importDatabase()
      showMessage({
        type: 'success',
        message: 'Importado com sucesso!'
      })
    } catch (e) {
      if (e.message === 't1') {
        showMessage({
          type: 'success',
          message: 'Operação cancelada!'
        })
      } else if (e.message === 't2') {
        showMessage({
          type: 'danger',
          message: 'Arquivo não é um banco SQLite!'
        })
      } else {
        showMessage({
          type: 'danger',
          message: 'Erro ao tentar importar!'
        })
      }
    }
  }, [])
  const handleToExport = React.useCallback(async () => {
    try {
      await database.exportDatabase()
      showMessage({
        type: 'success',
        message: 'Exportado com sucesso!'
      })
    } catch (e) {
      showMessage({
        type: 'danger',
        message: 'Erro ao tentar exportar!'
      })
    }
  }, [])
  return (
    <ScrollView style={styles.container}>
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
        title="Playlists"
        description="Ordene suas músicas atravez de playlists"
        onPress={handleToPlaylists}
        left={props => <List.Icon {...props} icon="playlist-music" />}
      />
      <List.Item
        title="Hard Reset"
        description="Limpa todos os dados do App"
        onPress={handleToResetApp}
        left={props => <List.Icon {...props} icon="harddisk-remove" />}
      />
      <List.Item
        title="Importar Banco de Dados"
        description="Sobrescreve músicas, artistas e playlists de um banco de dados externo."
        onPress={handleToImport}
        left={props => <List.Icon {...props} icon="database-import" />}
      />
      <List.Item
        title="Exportar Banco de Dados"
        description="Salva uma cópia do banco de dados na pasta Download"
        onPress={handleToExport}
        left={props => <List.Icon {...props} icon="database-export" />}
      />
      <List.Item
        onPress={handleAbout}
        title="Sobre o Aplicativo"
        description="Sobre, Codigo-Aberto, Contato"
        left={props => <List.Icon {...props} icon="information" />}
      />
      <UrlInfo {...urlInfo.props} next={handleUrlInfo} />
      <LoadFadedScreen {...loadedScreen.props} />
    </ScrollView>
  )
}
export default OptionsScreen
