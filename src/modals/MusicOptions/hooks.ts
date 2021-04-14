import React from 'react'
import { showMessage } from 'react-native-flash-message'

import type { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import type { ParamListBase } from '@react-navigation/routers'

import { UseLoadFadedScreen } from '../../components/LoadFadedScreen'
import { LoadedUsecontext } from '../../contexts/player/types'
import { LoadedUseTimeContext } from '../../contexts/timer/types'
import { DatabaseService } from '../../services/database/databaseService'
import { IMusic, IMusicInPlaylist } from '../../types'
import { UseSelectPlaylistModalReturn } from '../SelectPlaylist'

export const goToArtists = (
  navigation: NavigationProp<ParamListBase>
): ((artistsId: string) => void) => {
  return React.useCallback((artistId: string) => {
    navigation.navigate('Artist', { artistId })
  }, [])
}

type ShowMessageType = typeof showMessage

type MusicList = IMusic[] | undefined
type MusicListWithPlaylist = IMusicInPlaylist[] | undefined

export const deleteMusic = (
  database: DatabaseService,
  loadedScreen: UseLoadFadedScreen,
  setMusicList: React.Dispatch<
    React.SetStateAction<MusicList | MusicListWithPlaylist>
  >,
  musicList: IMusic[] | IMusicInPlaylist[] | undefined,
  playerContext: LoadedUsecontext,
  playerListenners: unknown[],
  timer: LoadedUseTimeContext,
  showMessage: ShowMessageType
): ((musicId: string) => void) => {
  return React.useCallback(
    async (musicId: string) => {
      loadedScreen?.open()
      const playlists = await database.tables.playlist.getPlaylistsByMusic(
        musicId
      )
      database.tables.music
        .delete(musicId)
        .then(async () => {
          async function reorderPlaylists(playlistId: number) {
            const playlistItens = await database.tables.playlist.listMusics(
              playlistId
            )
            const newPlaylist = playlistItens.map((music, index) => {
              return {
                ...music,
                position: index
              }
            })
            await database.tables.playlist.updatePositions(newPlaylist)
          }
          await Promise.all(playlists.map(reorderPlaylists))
          setMusicList(musicList?.filter(music => music.id !== musicId))
          await playerContext.removeMusicFromMusicList(musicId)
          timer?.set(0, 0)
          loadedScreen?.close()
          showMessage({
            type: 'success',
            message: 'Musica deletada'
          })
        })
        .catch(() => {
          showMessage({
            type: 'danger',
            message: 'Ocorreu um erro ao deletar a musica.'
          })
          loadedScreen?.close()
        })
    },
    [...playerListenners, musicList]
  )
}

export const shareInQRCode = (
  database: DatabaseService,
  navigation: NavigationProp<ParamListBase>
): ((musicId: string) => void) => {
  return React.useCallback(async (musicId: string) => {
    const music = await database.tables.music.get(musicId)
    if (music) {
      navigation.navigate('QRCodeShare', { music })
    }
  }, [])
}
export const removeMusicFromPlaylist = (
  database: DatabaseService,
  loadedScreen: UseLoadFadedScreen,
  setMusicList: React.Dispatch<
    React.SetStateAction<IMusicInPlaylist[] | undefined>
  >,
  musicList: IMusicInPlaylist[] | undefined,
  showMessage: ShowMessageType
): ((playlistItemId: number) => void) => {
  return React.useCallback(
    async (playlistItemId: number) => {
      loadedScreen?.open()
      try {
        await database.tables.playlist.removeFromPlaylist(playlistItemId)
        const newPlaylist = musicList
          ?.filter(music => music.playlistItemId !== playlistItemId)
          .map((music, index) => {
            return {
              ...music,
              position: index
            }
          }) as IMusicInPlaylist[]
        await database.tables.playlist.updatePositions(newPlaylist)
        setMusicList(newPlaylist)
        showMessage({
          type: 'success',
          message: 'Música removida da playlist com sucesso!'
        })
      } catch (e) {
        showMessage({
          type: 'danger',
          message: 'Erro ao tentar remover música da playlist!'
        })
      } finally {
        loadedScreen?.close()
      }
    },
    [musicList]
  )
}
export const openPlaylistSelector = (
  database: DatabaseService,
  loadedScreen: UseLoadFadedScreen,
  showMessage: ShowMessageType,
  playlistSelectorModal: UseSelectPlaylistModalReturn
): ((musicId: string) => void) => {
  return React.useCallback(async (musicId: string) => {
    loadedScreen?.open()
    try {
      const playlists = await database.tables.playlist.list()
      loadedScreen?.close()
      const playlistId = await playlistSelectorModal?.(playlists)
      loadedScreen?.open()
      if (!playlistId) return
      await database.tables.playlist.addToPlaylist(playlistId, musicId)
      showMessage({
        type: 'success',
        message: 'Adicionado com sucesso!'
      })
    } catch (e) {
      showMessage({
        type: 'danger',
        message: 'Erro ao tentar adicionar música a playlist!'
      })
    } finally {
      loadedScreen?.close()
    }
  }, [])
}
