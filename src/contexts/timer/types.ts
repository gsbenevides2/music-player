import React from 'react'

export interface TimerState {
  timeDataTo: number
  timeDataFrom: number
}

export interface ContextInterface {
  timerState: TimerState
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>
}

export type ContextType = undefined | ContextInterface

export interface LoadedUsecontext {
  set: (to: number, from: number) => void
  timeDataTo?: number
  timeDataFrom?: number
}
