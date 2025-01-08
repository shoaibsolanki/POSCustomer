import React from 'react';
import Navbar from './Componenets/Navbar';
import Footer from './Componenets/Footer';
// import './RootLayout.css';

const RootLayout = ({ children }) => {
    const isAuthPage =
    location.pathname === "/login" || location.pathname === "/Signup" || location.pathname === "/landing";

    return (
        <div className="root-layout">
            <nav className="navbar">
            {!isAuthPage && <Navbar />}
            </nav>
            <main className="content">
                {children}
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

export default RootLayout;