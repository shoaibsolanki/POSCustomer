import React from 'react';
import Cart from '../Componenets/Cart';
import { useCart } from '../Context/CartContext';

const CartPage = () => {
    const {cart} = useCart()
    return (
        <div>
            <Cart />
        </div>
    );
};

export default CartPage;