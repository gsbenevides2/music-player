import React from 'react'
import { View, Image, StyleProp, ViewStyle } from 'react-native'
import { Subheading, Title } from 'react-native-paper'

import noData from '../../assets/no_data.png'
import noMusic from '../../assets/no_music.png'
import noNetwork from '../../assets/no_network.png'
import notFound from '../../assets/not_found.png'

const images = {
  noData,
  noMusic,
  notFound,
  noNetwork
}

interface Props {
  imageName: 'noData' | 'noMusic' | 'notFound' | 'noNetwork'
  title: string
  description: string
  overlay?: boolean
  fullSize?: boolean
}

const Warning: React.FC<Props> = props => {
  const styles: StyleProp<ViewStyle> = { alignItems: 'center' }
  if (props.fullSize) styles.flex = 1
  if (props.overlay) styles.backgroundColor = 'rgba(0,0,0,0.5)'

  return (
    <View style={styles}>
      <Image
        resizeMode={'contain'}
        style={{ width: '80%', height: '80%' }}
        source={images[props.imageName]}
      />
      <Title>{props.title}</Title>
      <Subheading>{props.description}</Subheading>
    </View>
  )
}
export default Warning
