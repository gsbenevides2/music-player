import React from 'react'
import { Image, useWindowDimensions } from 'react-native'

export interface AlbumImageProps {
  url?: string
  horizontal: boolean
}

export const AlbumImage: React.FC<AlbumImageProps> = props => {
  const size = useWindowDimensions().width * (props.horizontal ? 0.35 : 0.9)
  return (
    <Image
      resizeMode="contain"
      style={{ width: size, height: size, marginBottom: 20 }}
      source={
        props.url
          ? {
              uri: props.url
            }
          : require('../../../../assets/no_music.png')
      }
    />
  )
}
export const AlbumImageMemorized = React.memo(AlbumImage)
