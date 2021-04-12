import React from 'react'
import { View, Image, StyleProp, ViewStyle } from 'react-native'
import { Subheading, Title } from 'react-native-paper'

import accessDenied from '../../assets/access_denied.svg'
import music from '../../assets/music.svg'
import noData from '../../assets/no_data.svg'
import notFound from '../../assets/not_found.svg'
import signalSearching from '../../assets/signal_searching.svg'
import space from '../../assets/void.svg'

const images = {
  noData,
  accessDenied,
  space,
  music,
  signalSearching,
  notFound
}

interface Props {
  imageName: keyof typeof images
  title: string
  description: string
  overlay?: boolean
  fullSize?: boolean
}

const Warning: React.FC<Props> = props => {
  const styles: StyleProp<ViewStyle> = { alignItems: 'center' }
  if (props.fullSize) styles.flex = 1
  if (props.overlay) styles.backgroundColor = 'rgba(0,0,0,0.5)'
  const Image = React.createElement(images[props.imageName], {
    width: '80%',
    height: '80%'
  })
  return (
    <View style={styles}>
      {Image}
      <Title>{props.title}</Title>
      <Subheading>{props.description}</Subheading>
    </View>
  )
}
export default Warning
/*
								resizeMode={'contain'}
								style={{ width: '80%', height: '80%' }}
								source={images[props.imageName]}
	* */
