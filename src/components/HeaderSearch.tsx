import React from 'react'
import { Appbar, Searchbar } from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'

import Header from './Header'

interface Props {
  value: string
  placeholder: string
  onTextChange: (text: string) => void
  back: () => void
}

export default function HeaderSearch(props: Props): React.ReactNode {
  return (
    <Appbar.Header>
      <Searchbar
        placeholder={props.placeholder}
        onChangeText={props.onTextChange}
        onIconPress={props.back}
        icon="arrow-left"
      />
    </Appbar.Header>
  )
}

interface Param {
  navigation: ReturnType<typeof useNavigation>
  placeholder: string
  onText: (text: string) => void
  back: () => void
}
export function useHeaderSearch(data: Param): void {
  const { navigation, placeholder, onText, back } = data
  const [value, setValue] = React.useState<string>()

  const onTextChange = React.useCallback(
    (text: string) => {
      onText(text)
      setValue(text)
    },
    [onText]
  )

  const onBack = React.useCallback(() => {
    back()
    navigation.setOptions({
      header: Header
    })
  }, [])

  React.useEffect(() => {
    if (value !== undefined) {
      navigation.setOptions({
        header: () => {
          return HeaderSearch({
            placeholder: placeholder,
            onTextChange: onTextChange,
            back: onBack,
            value: value
          })
        }
      })
    }
  }, [value, placeholder])
  const open = React.useCallback(() => {
    setValue('')
  }, [])
  React.useEffect(() => {
    const HeaderRight = () => <Appbar.Action icon="magnify" onPress={open} />
    navigation.setOptions({
      headerRight: HeaderRight
    })
  }, [])
}
