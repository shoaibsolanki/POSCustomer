import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Page/Home';
import RootLayout from './RootLayout'
import Landingpage from './Page/Landingpage';
import StoresPage from './Page/StoresPage';
import {  CartProvider } from './Context/CartContext';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    <Router>
      <CartProvider>

      <RootLayout>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/stores" element={<StoresPage/>} />
        
      </Routes>
      </RootLayout>
      </CartProvider>
      <Routes>
        <Route path="/landing" element={<Landingpage/>} />

      </Routes>
    </Router>
    </>
  )
}

export default App
