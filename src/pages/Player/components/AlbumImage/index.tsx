import React from 'react'
import { Image, useWindowDimensions } from 'react-native'

import Music from '../../../../assets/music.svg'

export interface AlbumImageProps {
  url?: string
  horizontal: boolean
}

export const AlbumImage: React.FC<AlbumImageProps> = props => {
  const size = useWindowDimensions().width * (props.horizontal ? 0.35 : 0.9)
  if (props.url) {
    return (
      <Image
        resizeMode="contain"
        style={{ width: size, height: size, marginBottom: 20 }}
        source={{
          uri: props.url
        }}
      />
    )
  } else {
    return <Music width={size} height={size} />
  }
}
export const AlbumImageMemorized = React.memo(AlbumImage)
