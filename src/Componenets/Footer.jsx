import { Instagram, WhatsApp } from '@mui/icons-material'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-background text-foreground p-6 bg-slate-300">
      <div className="text-start mb-4">
        <h1 className="text-2xl font-bold">OMNI Stores.</h1>
        <p className="text-muted-foreground">
          {/* {address} */}
        </p>
      </div>
      <div className="text-start mb-4">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-muted-foreground">905-519-8673</p>
        {/* <p className="text-muted-foreground">{email}</p> */}
      </div>
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email Address"
          className="border border-border rounded-lg p-2 w-full max-w-xs mx-auto"
        />
      </div>
      <p className="text-muted-foreground mb-4">
        Join our subscribers and get best recipe delivered each week!
      </p>
      <button className="bg-dark text-white text-secondary-foreground hover:bg-secondary/80 rounded-lg p-2">
        Subscribe
      </button>
      <div className="flex justify-start space-x-4 mt-4">
        <a href="#" aria-label="Twitter">
        <Instagram className="text-pink-600" />
        </a>
        {/* <a href="#" aria-label="Facebook">
          <img aria-hidden="true" alt="facebook-icon" src="https://openui.fly.dev/openui/facebook.svg?text=📘" />
        </a> */}
        <a  href="https://wa.me/+19055198673"
          target="_blank"
          rel="noreferrer">
        <WhatsApp className="text-green-500" />{" "}
        </a>
      </div>
      <div className="text-center mt-4 text-muted-foreground">
        <p>© 2024 OMNISTORE Inc. All rights Reserved</p>
      </div>
    </footer>
  )
}

export default Footer