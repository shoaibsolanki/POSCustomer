import { ShoppingCart } from "@mui/icons-material";
import React from "react";
import {useCart} from '../Context/CartContext'
const AddToCartButton = ({ item }) => {
  const { addItem, cart } = useCart();
  const AddedItem = Array.isArray(cart) ? cart.find((el) => el.item_id === item.item_id) : null;

  return (
    <div className="my-4 flex items-center gap-8">
      <button
        onClick={() => addItem(item)}
        id="addItem"
        className="text-white flex bg-second p-2 rounded-md text-center hover:bg-[#de9b15] duration-300"
        style={{
          backgroundColor: AddedItem ? "green" : "#de9b15",
        }}
      >
        <p>{AddedItem ? AddedItem.product_qty : ""}</p>
        <ShoppingCart />
      </button>
    </div>
  );
};

export default AddToCartButton;
