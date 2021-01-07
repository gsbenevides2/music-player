// eslint-disable-next-line no-use-before-define
import React from 'react'

import Slider from '@react-native-community/slider'
import { Colors } from 'react-native-paper'
import { TimeTextAreaMemorized } from './textData'

interface MusicProgressBarProps {
  from: number
  to: number
  handleSliderPosition: (position: number) => void
}
function formatTime(millisecconds: number): string {
  const seccounds = millisecconds / 1000
  const minnutes = (seccounds / 60).toString().split('.')[0]

  const restOfSeccounds = (seccounds - Number(minnutes) * 60)
    .toString()
    .split('.')[0]

  return `${minnutes}:${
    restOfSeccounds.length === 1 ? `0${restOfSeccounds}` : restOfSeccounds
  }`
}
const SliderMemorized = React.memo(Slider)
export const MusicProgressBar: React.FC<MusicProgressBarProps> = props => {
  const [from, setFrom] = React.useState(props.from)
  const [isSliding, setIsSliding] = React.useState(false)
  React.useEffect(() => {
    if (!isSliding) {
      setFrom(props.from)
    } else setFrom(from)
  }, [props.from, isSliding])
  return (
    <>
      <TimeTextAreaMemorized
        from={formatTime(from)}
        to={formatTime(props.to)}
      />
      <SliderMemorized
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        value={from}
        onSlidingStart={position => {
          setIsSliding(true)
          setFrom(position)
        }}
        onValueChange={position => {
          setFrom(position)
        }}
        onSlidingComplete={position => {
          setIsSliding(false)
          setFrom(position)
          props.handleSliderPosition(position)
        }}
        maximumValue={props.to}
        thumbTintColor={Colors.deepPurple300}
        minimumTrackTintColor={Colors.deepPurple300}
        maximumTrackTintColor="#ffffff"
      />
    </>
  )
}
export const MusicProgressBarMemorized = React.memo(MusicProgressBar)
