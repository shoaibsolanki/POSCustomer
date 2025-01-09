import React, { useState } from "react";

const HeroSection = ({ data }) => {
//   const [isLoading, setIsLoading] = useState(true);
 
//   const handleImageLoad = () => {
//     setIsLoading(false);
//   };
  const selectedStore = localStorage.getItem('selectedStore');
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const { store_name,storeLogo,address} = parsedStore || {};

  return (<>
    <div  className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-6">
      {/* {isLoading && <ImageSkeleton />} */}
      {/* <div  className="sm:w-[1300px] sm:py-16 min-w-[350px] p-6 rounded-lg shadow-lg text-center"> */}
    <img
      src={storeLogo}
      alt="Store Logo"
      className="w-full h-full object-cover"
      />
    {/* <h2 className="text-2xl font-bold text-white">Up to 40% OFF</h2>
    <p className="text-white mt-2">ON YOUR FIRST ORDER</p>
    <button className="mt-4 bg-white text-pink-500 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-200">ORDER NOW</button> */}
  {/* </div> */}
  <div className=" float-start">
    <h1 className="font-bold text-2xl font-Inter">{store_name}</h1>
    <span>Indian</span> <br />
    <span>{address}</span>
  </div>
    </div>
    </>
  );
};

export default HeroSection;

const ImageSkeleton = () => (
  <div className="w-full h-[300px] bg-gray-300 animate-pulse rounded-xl"></div>
);
