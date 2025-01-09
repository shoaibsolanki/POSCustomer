import { ShoppingCart } from "@mui/icons-material";
import React from "react";
import { useCart } from "../../contexts/CartContext";

const AddToCartButton = ({ item }) => {
  const { addToCart, cart } = useCart();
  const AddedItem = cart?.find((el) => el.item_id === item.item_id);

  return (
    <div className="my-4 flex items-center gap-8">
      <button
        onClick={() => addToCart(item)}
        id="addToCart"
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
