import React from 'react'
import { Appbar } from 'react-native-paper'

import { StackHeaderProps } from '@react-navigation/stack'

export default function Header(props: StackHeaderProps): React.ReactNode {
  const HeaderRight = props.scene.descriptor.options.headerRight?.({
    tintColor: props.scene.descriptor.options.headerTintColor
  })
  return (
    <Appbar.Header>
      {props.previous && (
        <Appbar.BackAction onPress={props.navigation.goBack} />
      )}
      <Appbar.Content
        title={props.scene.descriptor.options.title}
      ></Appbar.Content>
      {HeaderRight}
    </Appbar.Header>
  )
}
