import React from 'react'

import * as ScreenOrientation from 'expo-screen-orientation'

export function useHorizontal(): boolean {
  const [horizontal, setHorizontal] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      const value = await ScreenOrientation.getOrientationAsync()
      setHorizontal(
        value === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          value === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      )
    }
    load()
    const OrientationSubscription = ScreenOrientation.addOrientationChangeListener(
      orientation => {
        const value = orientation.orientationInfo.orientation
        setHorizontal(
          value === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
            value === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        )
      }
    )
    return () => {
      ScreenOrientation.removeOrientationChangeListener(OrientationSubscription)
    }
  }, [])
  return horizontal
}
