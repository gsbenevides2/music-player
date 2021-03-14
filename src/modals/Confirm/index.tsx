// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Portal, Dialog, Button } from 'react-native-paper'

interface ContextState {
  name: string
  visible: boolean
  next?: (result: boolean) => void
}
type ContextType =
  | {
      state: ContextState
      setState: React.Dispatch<React.SetStateAction<ContextState>>
    }
  | undefined

const Context = React.createContext<ContextType>(undefined)

export const ConfirmModalProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<ContextState>({
    name: '',
    visible: false
  })
  const listenners = [state.name, state.visible, state.next]
  const close = React.useCallback(() => {
    setState({
      ...state,
      visible: false
    })
    state.next?.(false)
  }, listenners)
  const next = React.useCallback(() => {
    setState({
      ...state,
      visible: false
    })
    state.next?.(true)
  }, [...listenners])
  return (
    <Context.Provider value={{ state, setState }}>
      {children}
      <Portal>
        <Dialog visible={state.visible} dismissable={false}>
          <Dialog.Title>{state.name}</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={close}>Não</Button>
            <Button onPress={next}>Sim</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Context.Provider>
  )
}
type UseConfirmModal = (name: string) => Promise<boolean>

export function useConfirmModal(): UseConfirmModal | null {
  const context = React.useContext(Context)
  if (context) {
    return name => {
      return new Promise(resolve => {
        context.setState({
          name,
          visible: true,
          next: value => {
            resolve(value)
          }
        })
      })
    }
  } else {
    return null
  }
}
