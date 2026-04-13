import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AsideComponent from './components/AsideComponent';
import HeaderComponent from './components/HeaderComponent';

import Stats from "./pages/Stats"
import Prompt from "./pages/Prompt"
import Home from "./pages/Home"

import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <HeaderComponent />
        <div className="body-container">
          <AsideComponent />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/prompt" element={<Prompt />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
