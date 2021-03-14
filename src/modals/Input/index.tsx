// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Keyboard } from 'react-native'
import { Portal, Dialog, Button, TextInput } from 'react-native-paper'

interface ContextState {
  name: string
  label: string
  visible: boolean
  defaultValue?: string
  next?: (value: string) => void
}
type ContextType =
  | {
      state: ContextState
      setState: React.Dispatch<React.SetStateAction<ContextState>>
    }
  | undefined

const Context = React.createContext<ContextType>(undefined)

export const InputModalProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<ContextState>({
    name: '',
    label: '',
    visible: false
  })
  const [value, setValue] = React.useState('')

  const listenners = [state.name, state.label, state.visible, state.next]
  const close = React.useCallback(() => {
    setState({
      ...state,
      visible: false
    })
  }, listenners)
  const next = React.useCallback(() => {
    Keyboard.dismiss()
    state.next?.(value)
  }, [...listenners, value])
  return (
    <Context.Provider value={{ state, setState }}>
      {children}
      <Portal>
        <Dialog visible={state.visible} dismissable={false}>
          <Dialog.Title>{state.name}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              defaultValue={state.defaultValue}
              onEndEditing={next}
              label={state.label}
              onChangeText={setValue}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={close}>Sair</Button>
            <Button onPress={next}>Continuar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Context.Provider>
  )
}

interface Data {
  name: string
  label: string
  defaultValue?: string
}

interface UseInputModal {
  open: (data: Data) => Promise<string>
  close: () => void
}

export function useInputModal(): UseInputModal | null {
  const context = React.useContext(Context)
  if (context) {
    return {
      open(data) {
        return new Promise(resolve => {
          context.setState({
            ...data,
            visible: true,
            next: value => {
              resolve(value)
            }
          })
        })
      },
      close() {
        context.setState({
          ...context.state,
          visible: false
        })
      }
    }
  } else {
    return null
  }
}
