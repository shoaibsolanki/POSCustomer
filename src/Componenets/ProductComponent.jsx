import React, { useState, useEffect } from "react";
import { BASEURL } from "../services/http-Pos";
import AddToCartButton from "./AddToCartButton";
import ClearIcon from '@mui/icons-material/Clear';
import { useCart } from "../Context/CartContext";
import { Image } from "antd";
const ProductComponent = ({ clearSelectedUom ,handleUomChange, Uom, data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { bankAccount ,saasId,storeId  } = JSON.parse(localStorage.getItem("selectedStore"));
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const { deleteItem, cart } = useCart();
  const AddedItem = Array.isArray(cart) ? cart.find((el) => el.item_id === data.item_id) : null
 
  

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
        <Image
          className="w-full h-36 sm:h-40 bg-[#D6B6FA] object-cover"
          style={{height:"9rem" , width:"100%"}}
          src={`${BASEURL.ENDPOINT_URL}item/get-image/${data?.item_id}`}
          alt={data?.item_name}
        />
      </div>
      <div className="p-4">
        <h2 className="product-title text-primary text-start text-sm sm:text-base">
          {data?.item_name?.length > 30 ? `${data?.item_name?.slice(0, 30)}...` : data?.item_name}
        </h2>
        <div className="flex gap-3">
        <p className="priceTitle text-start text-black text-sm sm:text-base">
          {bankAccount} { data.selectedUom ?data?.price * data.selectedUom: data?.price} /-
        </p>
        <p  className=" line-through priceTitle text-start text-green-600 text-sm sm:text-base">
          {data.actual_price}/-
        </p>
        </div>
        <p className="text-gray-600 text-start font-semibold text-sm sm:text-base">{data?.category}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <AddToCartButton item={data} />
          {data?.selectedUom?<>
          <p className="text-gray-600 text-start font-semibold text-sm sm:text-base">
            {data.selectedUom * 1000} gm 
            <ClearIcon className="text-gray-600 cursor-pointer" onClick ={()=>{
              if(AddedItem){
                deleteItem(AddedItem.id)
                clearSelectedUom(AddedItem.item_id)
              }else{
                clearSelectedUom(data.item_id)
         
              }
            }}/>
          </p> 
          </> :
          
         (data.UOM == "W" &&<select value={data?.selectedUom} onChange={(e)=>{handleUomChange(e , data.item_id)}} className="w-32 border rounded h-10">
            <option>Select Unit</option>
            {Uom.map((unit, index) => (
              <option key={index} value={Number(unit.uomname) / 1000}>
                {unit.uomname} gm
              </option>
            ))}
          </select> )}
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
