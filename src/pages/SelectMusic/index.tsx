// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View, Image } from 'react-native'
import { TextInput, Title, Subheading } from 'react-native-paper'

import { useRoute, useNavigation } from '@react-navigation/native'

import { useLoadFadedScreen } from '../../components/LoadFadedScreen'
import MusicList from '../../components/MusicList'
import {
  DeezerService,
  IDeezerResult,
  IDeezerMusic
} from '../../services/deezer'

function removeDuplicatedMusicsAndConcat(
  old: IDeezerMusic[],
  results: IDeezerMusic[]
): IDeezerMusic[] {
  const filtedResults = results.filter(result => {
    return !old.find(music => music.id === result.id)
  })

  return [...old, ...filtedResults]
}

interface ScreenParams {
  resultForDeezer: IDeezerResult
  resultForYoutube: {
    generatedMusicName: string
    videoId: string
  }
}
const NoMusic: React.FC = () => (
  <View style={{ alignItems: 'center' }}>
    <Image
      resizeMode={'contain'}
      style={{ width: '80%', height: '80%' }}
      source={require('../../assets/not_found.png')}
    />
    <Title>Ops não encontrei nada</Title>
    <Subheading>Verefique o nome da musica ou tente uma outra url</Subheading>
  </View>
)
const SelectMusicScreen: React.FC = () => {
  const deezerService = new DeezerService()
  const { params } = useRoute()
  const loadedScreen = useLoadFadedScreen()
  const routeParams = params as ScreenParams
  const [inputSearch, setInputSearch] = React.useState(
    routeParams.resultForYoutube.generatedMusicName
  )
  const [deezerData, setDeezerData] = React.useState<IDeezerResult>(
    routeParams.resultForDeezer
  )
  const navigation = useNavigation()

  const inputSearchEnterCallback = React.useCallback(async () => {
    const resultForDeezer = await deezerService.searchMusic(inputSearch)
    setDeezerData(resultForDeezer)
  }, [inputSearch])

  const endOfList = React.useCallback(async () => {
    if (deezerData.next) {
      loadedScreen?.open()
      const resultForDeezer = await deezerService.searchMusicNext(
        inputSearch,
        deezerData.next
      )
      loadedScreen?.close()
      setDeezerData({
        next: resultForDeezer.next,
        musics: removeDuplicatedMusicsAndConcat(
          deezerData.musics,
          resultForDeezer.musics
        )
      })
    }
  }, [deezerData, inputSearch])

  const musicOnPressCallback = React.useCallback(
    (musicId: string) => {
      const music = deezerData.musics.find(music => music.id === musicId)
      navigation.navigate('Music', {
        music,
        youtubeId: routeParams.resultForYoutube.videoId
      })
    },
    [deezerData.musics]
  )

  return (
    <View>
      <TextInput
        value={inputSearch}
        onSubmitEditing={inputSearchEnterCallback}
        onChangeText={text => setInputSearch(text)}
        label="Música Procurada"
      />
      <View>
        <MusicList
          onPress={musicOnPressCallback}
          musics={deezerData.musics}
          onEndReached={endOfList}
        />
        {!deezerData.musics.length && <NoMusic />}
        {!deezerData.next && deezerData.musics.length
? (
          <Title style={{ alignSelf: 'center', flex: 1 }}>
            Fim Dos Resultados
          </Title>
        )
: null}
      </View>
    </View>
  )
}
export default SelectMusicScreen
