import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HashRouter } from 'react-router'
import Search from './components/Search'
import Browse from './components/Browse'

function App() {
  return <HashRouter>
    <Routes>
      <Route path ="/browse" element ={<Browse/>}></Route>
      <Route path ="/search" element ={<Search/>}></Route>
    </Routes>
  </HashRouter>
}
    

export default App
