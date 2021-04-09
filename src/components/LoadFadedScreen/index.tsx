import React from 'react'
import { ActivityIndicator, Portal, Modal } from 'react-native-paper'

interface ContextType {
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
}

const Context = React.createContext<ContextType | undefined>(undefined)

export const LoadFadedScreenProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState(false)

  return (
    <Context.Provider value={{ state, setState }}>
      {children}
      <Portal>
        <Modal visible={state} dismissable={false}>
          <ActivityIndicator size="large" />
        </Modal>
      </Portal>
    </Context.Provider>
  )
}

export type UseLoadFadedScreen =
  | {
      open: () => void
      close: () => void
    }
  | undefined
export function useLoadFadedScreen(): UseLoadFadedScreen {
  const context = React.useContext(Context)
  if (context) {
    return {
      open() {
        context.setState(true)
      },
      close() {
        context.setState(false)
      }
    }
  }
}
