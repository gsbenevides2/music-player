import React from 'react'
import { Text, ScrollView, Keyboard } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { List } from 'react-native-paper'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import * as WebBrowser from 'expo-web-browser'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { useConfirmModal } from '../../modals/Confirm'
import { useInputModal } from '../../modals/Input'
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
  const inputModal = useInputModal()
  const confirmModal = useConfirmModal()

  const handleToOpenModal = React.useCallback(() => {
    inputModal
      ?.open({ name: 'Adicionar música', label: 'Insira um link:' })
      .then(async url => {
        Keyboard.dismiss()
        loadedScreen?.open()
        try {
          const resultForYoutube = await youtubeService.getVideoIdAndTitle(url)
          const resultForDeezer = await deezerService.searchMusic(
            resultForYoutube.generatedMusicName
          )
          loadedScreen?.close()
          navigation.navigate('SelectMusic', {
            resultForDeezer,
            resultForYoutube
          })
          inputModal.close()
        } catch (e) {
          showMessage({
            message: 'Ocorreu um erro, verifique a url',
            type: 'danger'
          })
          loadedScreen?.close()
        }
      })
      .catch(() => {
        showMessage({
          message: 'Ocorreu um erro.',
          type: 'danger'
        })
        loadedScreen?.close()
        inputModal.close()
      })
  }, [])

  const handleToAllMusics = React.useCallback(() => {
    navigation.navigate('AllMusics')
  }, [])
  const handleToPlaylists = React.useCallback(() => {
    navigation.navigate('Playlists')
  }, [])
  const handleToResetApp = React.useCallback(async () => {
    const result = await confirmModal?.('Deseja realmente deletar tudo?')
    if (!result) {
      return showMessage({
        type: 'success',
        message: 'Operação cancelada!'
      })
    }
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
        onPress={handleToOpenModal}
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
    </ScrollView>
  )
}
export default OptionsScreen
