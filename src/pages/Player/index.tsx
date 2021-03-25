import React from 'react'
import { View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { AVPlaybackStatus } from 'expo-av'

import { getPlayerListenners } from '../../contexts/player/listenners'
import { usePlayerContext } from '../../contexts/player/use'
import { useHorizontal } from '../../useHorizontal'
import { onNetworkUpdatesInPlayer } from '../NoNetwork'
import { AlbumImageMemorized } from './components/AlbumImage'
import { MusicDataMemorized } from './components/MusicData'
import { MusicProgressBarMemorized } from './components/MusicProgressBar'
import { PlayerButtonsMemorized } from './components/PlayerButtons'
import { PlayerOptionsMemorized } from './components/PlayerOptions'
import styles from './styles'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PlayerScreen() {
  const navigation = useNavigation()
  const player = usePlayerContext()
  const horizontal = useHorizontal()
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
  const handlePlaybackStatusUpdate = React.useCallback(
    (playbackStatus: AVPlaybackStatus) => {
      if (playbackStatus.isLoaded) {
        player.setTimeData(
          playbackStatus.durationMillis || 0,
          playbackStatus.positionMillis
        )
        if (playbackStatus.didJustFinish) {
          player.playNext()
        }
        setIsPlaying(playbackStatus.isPlaying)
      } else {
        setIsPlaying(false)
      }
    },
    playerListennersData
  )

  React.useEffect(() => {
    player.sound?.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate)
  }, [player.sound, player.isRepeat, player.isShuffle])

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
            to={player.timeDataTo || 0}
            from={player.timeDataFrom || 0}
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

/*
	* Old Code for future implementation
import MusicInfo, { useMusicInfo } from '../../modals/MusicInfo'
		const musicInfo = useMusicInfo()
					<MusicInfo visible={musicInfo.visible} close={musicInfo.close} />
	*/
