import {  ShoppingCart } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
const Navbar = ({ search, setSearch, data }) => {
  const { cart } = useCart();
  const { authData } = useAuth();

  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const location = useLocation()
 
  useEffect(() => {
    if (authData && authData.id) {
      setUserId(authData.id);
    }
  }, [authData]);

  const handleProceedToProfile = () => {
    if (userId) { 
      // window.location.href = '/profile'
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
    <nav id="navbar" className="w-full">
      {/* upper navbar */}
      {/* <div className=" bg-lightgray text-dark p-4 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-sm md:text-lg flex items-center gap-2">
          Call with us:{" "}
          <a
            target="_blank"
            href="tel:+917755821175"
            className=" hover:underline flex items-center gap-2"
            rel="noreferrer"
          >
            <Call className=" text-green-500" /> (+91) 775-582-1175
          </a>
        </h2>

        <div className=" max-md:hidden flex flex-col md:flex-row justify-between gap-5 items-center text-sm md:text-lg">
          <h2 className="flex gap-2 items-center">
            <img src={location} alt="Location" /> Our Store
          </h2>
          <h2 className="flex gap-2 items-center">
            <img src={truck} alt="track_your_order" /> Track Your Order
          </h2>
        </div>
      </div> */}
      {/* Middle Navbar */}
      <div
        id="lower-navbar"
        className="w-full bg-white p-4 md:p-8 flex flex-col min-md:flex-row justify-between items-center"
      >
        <div className="flex justify-between items-center w-full">
          <div className="max-md:w-full flex gap-8 items-center">
            <Link to={`${location.pathname=='/'?"/landing":"/"}`}>
            <b className="text-black text-2xl">
            Omni Store
            </b>
              {/* <img
                src={logoImg}
                alt="FastSide Logo"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "150px",
                  maxHeight: "150px",
                }}
              /> */}
            </Link>
          </div>
          <div className="flex gap-4 items-center mt-4 md:mt-0">
            <button
              className="flex items-center gap-2"
              onClick={handleProceedToProfile}
            >
              <div className="flex gap-2 items-center bg-white text-black">
                <PersonIcon className="h-6 w-6" />
                {" "}
                <p className="hidden xl:block text-sm md:text-xl">
                  {userId ? "Profile" : "Login"}
                </p>
              </div>
            </button>
            <Link to="/cart" 
            // onClick={toggle}
            >
              <div className={`flex gap-1 items-center ${cart?.length>0?"text-green-500":"text-black "} `}>
              <ShoppingCart className="h-6 w-6 "  />

                <h3 className="flex items-center justify-center  rounded-full text-center text-xs md:text-sm">
                  {cart  && cart?.length}
                </h3>
                <p className="hidden xl:block text-sm md:text-lg ml-2">Cart</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
  // return(
  //   <header className="flex items-center justify-between mb-6">
  //   <div className="flex items-center space-x-4">
  //     <Menu className="h-6 w-6" />
  //     <h1 className="text-2xl font-bold">Food4u</h1>
  //     <div className="flex items-center space-x-1">
  //       <LocationOnIcon  className="h-4 w-4" />
  //       <span>Cambridge</span>
  //     </div>
  //     <div className="flex items-center space-x-1">
  //       <span>Now</span>
  //       {/* <ChevronDown className="h-4 w-4" /> */}
  //     </div>
  //   </div>
  //   <div className="flex items-center space-x-4">
  //     <div className="relative">
  //       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
  //       <input
  //         type="text"
  //         placeholder="Search food4u"
  //         className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
  //       />
  //     </div>
  //     <ShoppingCart className="h-6 w-6" />
  //     <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Log in</button>
  //     <button className="px-4 py-2 bg-black text-black rounded">Sign up</button>
  //   </div>
  // </header>
  // );
};

export default Navbar;
