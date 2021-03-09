import { useContext } from 'react'

import { PlayerContext } from '..'

import { YoutubeService } from '../../../services/youtube'
import { LoadedUsecontext } from '../types'
import { clearData } from './clearData'
import { pauseMusic } from './pauseMusic'
import { playMusic } from './playMusic'
import { playNext } from './playNext'
import { playPrevious } from './playPrevious'
import { removeArtistFromMusicList } from './removeArtistFromMusicList'
import { removeMusicFromMusicList } from './removeMusicFromMusicList'
import { setMusicList } from './setMusicList'
import { setRepeat } from './setRepeat'
import { setShuffle } from './setShuffle'
import { setTimeData } from './setTimeData'
import { startPlaylist } from './startPlayList'

export function usePlayerContext(): LoadedUsecontext {
  const playerContext = useContext(PlayerContext)
  const youtubeService = new YoutubeService()

  return {
    playMusic: playMusic(playerContext),
    pauseMusic: pauseMusic(playerContext),
    playNext: playNext(playerContext, youtubeService),
    playPrevious: playPrevious(playerContext, youtubeService),
    startPlaylist: startPlaylist(playerContext, youtubeService),
    setMusicList: setMusicList(playerContext),
    setShuffle: setShuffle(playerContext),
    setRepeat: setRepeat(playerContext),
    setTimeData: setTimeData(playerContext),
    removeMusicFromMusicList: removeMusicFromMusicList(
      playerContext,
      youtubeService
    ),
    removeArtistFromMusicList: removeArtistFromMusicList(
      playerContext,
      youtubeService
    ),
    clearData: clearData(playerContext),
    ...playerContext?.playerState
  }
}
