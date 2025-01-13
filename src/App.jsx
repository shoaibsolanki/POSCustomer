import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {  Route, Routes } from 'react-router-dom';
import Home from './Page/Home';
import RootLayout from './RootLayout'
import Landingpage from './Page/Landingpage';
import StoresPage from './Page/StoresPage';
import {  CartProvider } from './Context/CartContext';
import Login from './Page/Login';
import Cart from './Componenets/Cart';
import CartPage from './Page/Cartpage';
import Profile from './Page/Profile';
import Checkout from './Page/Checkout';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    
      <CartProvider>

      <RootLayout>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/stores" element={<StoresPage/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/cart" element={<CartPage/>} />
        <Route path="/landing" element={<Landingpage/>} />
        <Route path="/checkout" element={<Checkout/>} />

        <Route path="profile" element={<Profile/>} />

      </Routes>
      </RootLayout>
      </CartProvider>
    
    </>
  )
}

export default App
