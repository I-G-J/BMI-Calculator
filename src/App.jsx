import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import  Header from './components/Header'
import Bmibox from './components/Bmibox'
// import './App.css'

import React from 'react'

const App = () => {
  return (
    <div>
      <Header />
      <Bmibox />

    </div>
  )
}

export default App