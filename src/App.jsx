import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HashRouter, Route, Routes } from 'react-router'
import Search from './components/Search'
import Browse from './components/Browse'
import MushNav from './components/MushNav'
import Login from './components/Login'
import MushList from './components/MushList'

function App() {
  return <HashRouter>
    <Routes>
      <Route path ="/" element = {<MushNav/>}>
        <Route index element={<Browse/>} />
        <Route path ="/browse" element ={<Browse/>}></Route>
        <Route path ="/search" element ={<Search/>}></Route>
        <Route path ="/login" element ={<Login/>}></Route>
        <Route path ="/list" element ={<MushList/>}></Route>
      </Route>
      
    </Routes>
  </HashRouter>
}
    

export default App
