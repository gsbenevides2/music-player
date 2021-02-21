// eslint-disable-next-line no-use-before-define
import React from 'react'
import { View } from 'react-native'

import { usePlayerContext } from '../../contexts/player/use'
import { useHorizontal } from '../../useHorizontal'
import { AlbumImageMemorized } from './components/AlbumImage'
import { MusicDataMemorized } from './components/MusicData'
import { MusicProgressBarMemorized } from './components/MusicProgressBar'
import { PlayerButtonsMemorized } from './components/PlayerButtons'
import styles from './styles'
import { PlayerOptionsMemorized } from './components/PlayerOptions'
import { useNavigation } from '@react-navigation/native'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PlayerScreen() {
  const navigation = useNavigation()
  const player = usePlayerContext()
  const horizontal = useHorizontal()
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [timeData, setTimeData] = React.useState({
    to: 0,
    from: 0
  })

  const handlePlayOrPauseButton = React.useCallback(async () => {
    const soundStatus = await player.sound?.getStatusAsync()
    if (soundStatus?.isLoaded) {
      if (soundStatus.isPlaying) {
        await player.pauseMusic()
      } else {
        await player.playMusic()
      }
    }
  }, [player])

  const handleSliderPosition = React.useCallback(
    async (position: number) => {
      await player.sound?.setPositionAsync(position)
    },
    [player]
  )

  const handleToNextMusic = React.useCallback(() => {
    player.playNext()
  }, [player])

  const handleToPreviousMusic = React.useCallback(() => {
    player.playPrevious()
  }, [player])
  const handleToReproductionListScreen = React.useCallback(() => {
    navigation.navigate('ReproductionList')
  }, [])

  React.useEffect(() => {
    player.sound?.setOnPlaybackStatusUpdate(playbackStatus => {
      if (playbackStatus.isLoaded) {
        setTimeData({
          to: playbackStatus.durationMillis || 0,
          from: playbackStatus.positionMillis
        })
        if (playbackStatus.didJustFinish) {
          player.playNext()
        }
        setIsPlaying(playbackStatus.isPlaying)
      } else {
        setIsPlaying(false)
      }
    })
  }, [player.sound, player.musicActualy])
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
            openReproductionList={handleToReproductionListScreen}
          />
          <MusicProgressBarMemorized
            {...timeData}
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
