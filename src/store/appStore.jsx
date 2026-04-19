import { createContext, useContext, useState, useTransition } from 'react'
import { ENERGY_TYPES, FREQUENCY } from '../constants/energyTypes'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [activeEnergy, _setActiveEnergy] = useState(ENERGY_TYPES.OIL)
  const [frequency, _setFrequency] = useState(FREQUENCY.ANNUAL)
  const [scope, setScope] = useState('world')
  const [activeTab, setActiveTab] = useState('production')
  const [, startTransition] = useTransition()

  // Wrap energy/frequency changes in transitions for smooth switching (React 19)
  const setActiveEnergy = (type) => startTransition(() => _setActiveEnergy(type))
  const setFrequency = (freq) => startTransition(() => _setFrequency(freq))

  return (
    <AppContext.Provider value={{
      activeEnergy, setActiveEnergy,
      frequency, setFrequency,
      scope, setScope,
      activeTab, setActiveTab,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
