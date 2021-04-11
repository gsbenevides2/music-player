import React from 'react'
import { View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { AVPlaybackStatus } from 'expo-av'

import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { useTimerContext } from '../../contexts/timer'
import { useHorizontal } from '../../useHorizontal'
import { onNetworkUpdatesInPlayer } from '../NoNetwork'
import { AlbumImageMemorized } from './components/AlbumImage'
import { MusicDataMemorized } from './components/MusicData'
import { MusicProgressBarMemorized } from './components/MusicProgressBar'
import { PlayerButtonsMemorized } from './components/PlayerButtons'
import { PlayerOptionsMemorized } from './components/PlayerOptions'
import styles from './styles'

const PlayerScreen: React.FC = () => {
  const navigation = useNavigation()
  const player = usePlayerContext()
  const horizontal = useHorizontal()
  const timer = useTimerContext()
  onNetworkUpdatesInPlayer()
  const playerListennersData = getPlayerListenners(player)

  const [isPlaying, setIsPlaying] = React.useState(false)

  const handlePlayOrPauseButton = React.useCallback(async () => {
    if (isPlaying) {
      await player.pauseMusic()
    } else {
      await player.playMusic()
    }
  }, [...playerListennersData, isPlaying])

  const handleSliderPosition = React.useCallback(async (position: number) => {
    await player.sound?.setPositionAsync(position)
  }, playerListennersData)

  const handleToNextMusic = React.useCallback(() => {
    player.playNext()
  }, playerListennersData)

  const handleToPreviousMusic = React.useCallback(() => {
    player.playPrevious()
  }, playerListennersData)

  const handleToReproductionListScreen = React.useCallback(() => {
    navigation.navigate('ReproductionList')
  }, [])
  const playbackStatusUpdated = React.useCallback(
    (playbackStatus: AVPlaybackStatus) => {
      if (playbackStatus.isLoaded) {
        timer?.set(
          playbackStatus.durationMillis || 0,
          playbackStatus.positionMillis
        )
        if (playbackStatus.didJustFinish) {
          player.playNext()
        }
        if (isPlaying !== playbackStatus.isPlaying) {
          setIsPlaying(playbackStatus.isPlaying)
        }
      } else {
        setIsPlaying(false)
      }
    },
    [...playerListennersData, isPlaying]
  )
  React.useEffect(() => {
    player.sound?.setOnPlaybackStatusUpdate(playbackStatusUpdated)
  }, [...playerListennersData, isPlaying])
  return (
    <View
      style={horizontal ? styles.containerHorizontal : styles.containerVertical}
    >
      <AlbumImageMemorized
        horizontal={horizontal}
        url={player.musicActualy?.coverUrl}
      />

      <View
        style={
          horizontal
            ? styles.controlsAreaHorizontal
            : styles.controlsAreaVertical
        }
      >
        <MusicDataMemorized
          musicName={player.musicActualy?.name}
          artistName={player.musicActualy?.artist.name}
        />
        <View style={styles.playerControlArea}>
          <PlayerOptionsMemorized
            isShuffle={player.isShuffle || false}
            onShuffle={player.setShuffle}
            onRepeat={player.setRepeat}
            isRepeat={player.isRepeat || false}
            openReproductionList={handleToReproductionListScreen}
          />
          <MusicProgressBarMemorized
            to={timer?.timeDataTo || 0}
            from={timer?.timeDataFrom || 0}
            handleSliderPosition={handleSliderPosition}
          />
          <PlayerButtonsMemorized
            isPlaying={isPlaying}
            handlePrevious={handleToPreviousMusic}
            handleNext={handleToNextMusic}
            handlePlayOrPause={handlePlayOrPauseButton}
          />
        </View>
      </View>
    </View>
  )
}
export default PlayerScreen
/*
	* Old Code for future implementation
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
		const musicInfo = useMusicInfo()
					<MusicInfo visible={musicInfo.visible} close={musicInfo.close} />
	*/
