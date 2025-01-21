import React from 'react';
import Navbar from './Componenets/Navbar';
import Footer from './Componenets/Footer';
import { useLocation } from 'react-router-dom';
// import './RootLayout.css';

const RootLayout = ({ children }) => {
    const location = useLocation();
    const isAuthPage =
    location.pathname === "/login" || location.pathname === "/Signup" || location.pathname === "/landing";

    return (
        <div className="root-layout bg-white">
            <nav className="navbar">
            {!isAuthPage && <Navbar />}
            </nav>
            <main className="content bg-white">
                {children}
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

export default RootLayout;