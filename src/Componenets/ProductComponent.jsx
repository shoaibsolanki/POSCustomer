import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASEURL } from "../services/http-Pos";
import AddToCartButton from "./AddToCartButton";
const ProductComponent = ({ Uom, data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { bankAccount ,saasId,storeId  } = JSON.parse(localStorage.getItem("selectedStore"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

 
  

  if (isLoading) {
    return (
      <div className="border-[1px] p-4 border-gray-400 rounded-xl flex flex-col w-full max-w-[400px] relative animate-pulse">
        <div className="w-full h-[200px] bg-gray-300 rounded-xl"></div>
        <div className="mt-4 w-full space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[18rem] bg-white shadow-lg rounded-lg overflow-hidden m-2 inline-block">
      <div className="relative">
        <img
          className="w-full h-36 sm:h-40 bg-[#D6B6FA] object-cover"
          src={`${BASEURL.ENDPOINT_URL}item/get-image/${data?.item_id}`}
          alt={data?.item_name}
        />
      </div>
      <div className="p-4">
        <h2 className="product-title text-primary text-start text-sm sm:text-base">
          {data?.item_name?.length > 30 ? `${data?.item_name?.slice(0, 30)}...` : data?.item_name}
        </h2>
        <p className="priceTitle text-start text-black text-sm sm:text-base">
          {bankAccount} {data?.price}/-
        </p>
        <p className="text-gray-600 text-start font-semibold text-sm sm:text-base">{data?.category}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <AddToCartButton item={data} />
          <select className="w-32 border rounded h-10">
            <option>Select Unit</option>
            {Uom.map((unit, index) => (
              <option key={index} value={unit.uomname}>
                {unit.uomname}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
