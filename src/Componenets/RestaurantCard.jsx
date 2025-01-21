import React from 'react';
const RestaurantCard = ({store,onClick,name,address}) => {
  return (
    <div onClick={()=>onClick(store)} className="cursor-pointer max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src={store.storeLogo} alt="" />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-bold">{name}</h5>
          <div className="flex items-center">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="ml-1 text-sm font-bold">4.9</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm my-2">
          <span className="flex items-center mr-3">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2C6.686 2 4 4.686 4 8a6 6 0 0010 4.472V14h2v-1.528A6 6 0 0016 8c0-3.314-2.686-6-6-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z" />
            </svg>
            1-1.5 km
          </span>
          <span className="mx-1">•</span>
          <span>10-15 min</span>
        </div>
        <div className="text-gray-500 text-sm">
          <span className="font-bold">Address: </span>
          {address}
        </div>
        {/* <div className="text-gray-500 text-sm">
          <span className="font-bold">cuisines: </span>
          {cuisines && cuisines.map((el)=>{return(
            <span key={el} className="mx-1">{el}</span>
          )})}
        </div> */}
      </div>
    </div>
  );
};

export default RestaurantCard;