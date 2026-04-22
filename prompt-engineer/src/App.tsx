import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useState } from 'react';

import AsideComponent from './components/AsideComponent';
import HeaderComponent from './components/HeaderComponent';

import Stats from './pages/Stats'
import Prompt from './pages/Prompt'
import Home from './pages/Home'
import Outputs from './pages/Outputs';

import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')

  return (
    <Router>
      <div className='app-container'>
        <HeaderComponent />
        <div className='body-container'>
          <AsideComponent />
          <div className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/stats' element={<Stats />} />
              <Route path='/prompt' element={<Prompt prompt={prompt} setPrompt={setPrompt} />} />
              <Route path='/outputs' element={<Outputs />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
