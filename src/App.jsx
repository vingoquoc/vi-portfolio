import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import DynamicPortfolio from './components/DynamicPortfolio'

function App() {
  return (
    <ThemeProvider>
      <DynamicPortfolio />
    </ThemeProvider>
  )
}

export default App