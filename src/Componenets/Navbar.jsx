import React from 'react';
import { Link } from 'react-router-dom';
// import './Navbar.css'; // Make sure to create a CSS file for styling

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/">Logo</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
          </li>
          <li>
            <Link to="/services" className="text-gray-300 hover:text-white">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;