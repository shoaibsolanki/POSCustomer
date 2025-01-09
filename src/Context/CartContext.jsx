import React, { createContext, useReducer } from 'react';
import DataService from '../services/requestApi'
// Create a context
const CartContext = createContext();

// Define initial state
const initialState = {
    cart: []
};

// Define reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                cart: action.payload
            };
        case 'ADD_ITEM':
            return {
                ...state,
                cart: [...state.cart, action.payload]
            };
        case 'EDIT_ITEM':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id ? action.payload : item
                )
            };
        case 'DELETE_ITEM':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload.id)
            };
        default:
            return state;
    }
};

// Define provider component
const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const selectedStore = localStorage.getItem("selectedStore");
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const { saasId, storeId } = parsedStore || {};
const getCart = async (userId) => {
    try {
        // const response = await DataService.GetCartItems(saasId, storeId,) ;
        // const data = await response.json();
        dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
        console.error('Failed to fetch cart:', error);
    }
};
    const addItem = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const editItem = (item) => {
        dispatch({ type: 'EDIT_ITEM', payload: item });
    };

    const deleteItem = (id) => {
        dispatch({ type: 'DELETE_ITEM', payload: { id } });
    };

    return (
        <CartContext.Provider value={{ cart: state.cart, addItem, editItem, deleteItem }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartContext, CartProvider };
const useCart = () => {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export { useCart };