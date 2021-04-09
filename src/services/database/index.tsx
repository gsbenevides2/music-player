import React from 'react'

import { DatabaseService } from './databaseService'

const databaseService = new DatabaseService()

const Context = React.createContext<DatabaseService>(databaseService)

export const DatabaseProvider: React.FC = ({ children }) => (
  <Context.Provider value={databaseService}>{children}</Context.Provider>
)

export const useDatabase = (): DatabaseService => {
  return React.useContext(Context)
}
