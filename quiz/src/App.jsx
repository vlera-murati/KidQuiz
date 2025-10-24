import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Router,Route,Routes } from 'react-router-dom'
import Login from  './components/Login'
import { ContextProvider } from './hooks/useStateContext'
import Quiz from './components/Quiz'
import Result from './components/Result'
import NavBar from './components/NavBar'
import Questions from './components/Questions'
function App() {

  return (
    <>
    <ContextProvider>
  <BrowserRouter>
        <NavBar/>
     <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/quiz' element={<Quiz/>}/>
    <Route path='/questions' element={<Questions/>}/>
    <Route path='/result' element={<Result/>}/>
     </Routes>
     </BrowserRouter>
    </ContextProvider>
   
    </>
  )
}

export default App
