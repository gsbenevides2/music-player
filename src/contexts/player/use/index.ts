import { useContext } from 'react'

import { PlayerContext } from '..'

import { YoutubeService } from '../../../services/youtube'
import { LoadedUsecontext } from '../types'
import { pauseMusic } from './pauseMusic'
import { playMusic } from './playMusic'
import { playNext } from './playNext'
import { playPrevious } from './playPrevious'
import { setMusicList } from './setMusicList'
import { setShuffle } from './setShuffle'
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
    ...playerContext?.playerState
  }
}
