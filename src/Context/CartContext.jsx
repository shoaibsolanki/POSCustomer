import React, { createContext, useEffect, useReducer } from 'react';
import DataService from '../services/requestApi'
import { useAuth } from './AuthContext';
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
                cart: state.cart.filter(item => item.item_id !== action.payload.itemid)
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
  const {authData} = useAuth()
  const {id} = authData
const getCart = async () => {
    try {
        const response = await DataService.GetCartItems(saasId, storeId,id) ;
        const data =  response.data.data.products;
        dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
        console.error('Failed to fetch cart:', error);
    }
};
    const addItem = async (item) => {
        const response = await DataService.AddItemsToCart(item, saasId, storeId, id)
        console.log(response)
        if(response.data.status){
            getCart()
            // dispatch({ type: 'ADD_ITEM', payload: item });

        }
    };

    const editItem = async (qty,itemid) => {
        try {
            const response = await DataService.UpdateCartitem(qty, saasId, storeId, id, itemid);
            if (response.data.status) {
                getCart();
                // dispatch({ type: 'EDIT_ITEM', payload: item });
            }
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    const deleteItem =async (itemid) => {
            try {
                const res=await DataService.DeleteItemsFromCart( saasId, storeId, id, itemid);
                if(res.data.status){
                    getCart()
                    // dispatch({ type: 'DELETE_ITEM', payload: { itemid } });
                }
            } catch (error) {
                console.error('Failed to delete item:', error);
            }
    }; 
    //Clear All Product
    const clearCart = async () => {
        try {
            await DataService.DeleteAllItemsFromCart(saasId, storeId, id);
            dispatch({ type: 'SET_CART', payload: [] });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    useEffect(() => {
        if(id){
            getCart()
        }
    }, [])
    

    return (
        <CartContext.Provider value={{ cart: state.cart, addItem, editItem, deleteItem ,getCart,clearCart}}>
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