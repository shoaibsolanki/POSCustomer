import { Add, Remove, ShoppingCart } from "@mui/icons-material";
import React from "react";
import { useCart } from "../Context/CartContext";

const AddToCartButton = ({ item }) => {
  const { addItem, deleteItem, cart ,editItem} = useCart();
  const AddedItem = Array.isArray(cart) ? cart.find((el) => el.item_id === item.item_id) : null;
  //  console.log(AddedItem?.id)
  return (
    <div className="my-4 flex items-center gap-4 min-h-10">
      {AddedItem ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if(AddedItem.product_qty > 1){
              editItem(AddedItem.product_qty -1,  Array.isArray(cart) ? cart.find((el) => el.item_id === item.item_id).id : null)
            }else{
              deleteItem(AddedItem.id)
            }
          }}
            className="border-red-600 bg-white text-white p-0 rounded-md hover:bg-red-600 hover:text-white duration-300"
          >
            <Remove className="text-red-600 text-2xl mx-2 hover:text-white"/>
          </button>
          <span className="font-semibold text-lg text-black">{AddedItem.product_qty}</span>
          <button
            onClick={() => addItem(item)}
            className="border-green-500 bg-white text-white p-0 rounded-md hover:bg-green-600 duration-300"
          >
            <Add className="text-green-500 text-2xl mx-2 hover:text-white"/>
          </button>
        </div>
      ) : (
        <button
          onClick={() => addItem(item)}
          className="flex items-center gap-2 bg-[#de9b15] text-white px-4 py-2 rounded-md hover:bg-[#c48b12] duration-300"
        >
          <ShoppingCart />
          {/* <span>Add to Cart</span> */}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
