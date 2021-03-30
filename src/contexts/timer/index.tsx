// eslint-disable-next-line no-use-before-define
import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { ContextType, TimerState, LoadedUsecontext } from './types'

export const TimerContext = React.createContext<ContextType>(undefined)

export const TimerProvider: React.FC = ({ children }) => {
  const [timerState, setTimerState] = React.useState<TimerState>({
    timeDataTo: 0,
    timeDataFrom: 0
  })
  React.useEffect(() => {
    AsyncStorage.getItem('timerContext')
      .then(async value => {
        if (value) {
          const newTimerState = JSON.parse(value) as TimerState
          if (newTimerState) {
            setTimerState({
              ...newTimerState
            })
          } else {
            setTimerState({
              timeDataTo: 0,
              timeDataFrom: 0
            })
          }
        }
      })
      .catch(() => {
        setTimerState({
          timeDataTo: 0,
          timeDataFrom: 0
        })
      })
  }, [])
  return (
    <TimerContext.Provider value={{ timerState, setTimerState }}>
      {children}
    </TimerContext.Provider>
  )
}
export function useTimerContext(): LoadedUsecontext | undefined {
  const context = React.useContext(TimerContext)
  return context
    ? {
        ...context.timerState,
        set(to: number, from: number) {
          const timerState = { timeDataTo: to, timeDataFrom: from }
          AsyncStorage.setItem('timerContext', JSON.stringify(timerState))
          context.setTimerState(timerState)
        }
      }
    : undefined
}
