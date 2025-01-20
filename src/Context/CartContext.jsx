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
                cart: state.cart.filter(item => item.id !== action.payload.itemid)
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
  const id = authData ? authData.id : null;
const getCart = async () => {
    if (id) {
        try {
            const response = await DataService.GetCartItems(saasId, storeId, id);
            const data = response.data.data.products;
            dispatch({ type: 'SET_CART', payload: data });
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        dispatch({ type: 'SET_CART', payload: localCart });
    }
};
    // const addItem = async (item) => {
    //     const response = await DataService.AddItemsToCart(item, saasId, storeId, id)
    //     console.log(response)
    //     if(response.data.status){
    //         getCart()
    //         // dispatch({ type: 'ADD_ITEM', payload: item });

    //     }
    // };
    const addItem = async (item) => {
        if (id) {
            const response = await DataService.AddItemsToCart(item, saasId, storeId, id);
            console.log(response);
            if (response.data.status) {
                getCart();
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = localCart.filter((cartItem)=>( cartItem.item_id === item.item_id))
            console.log(existingItemIndex)
            if (existingItemIndex.length > 0) {
                // Item already exists in the cart, update the quantity
                localCart.forEach(cartItem => {
                    if (cartItem.item_id === item.item_id) {
                        cartItem.product_qty += 1;
                    }
                });
                localStorage.setItem('cart', JSON.stringify(localCart));
                dispatch({ type: 'SET_CART', payload: localCart });
                // getCart();
            } else {
                // Item does not exist in the cart, add new item with unique id
                const newItem = { ...item, id: Date.now() };
                localCart.push(newItem);
                dispatch({ type: 'ADD_ITEM', payload: newItem });
                localStorage.setItem('cart', JSON.stringify(localCart));
            }

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

    const deleteItem = async (itemid) => {
        if (id) {
            try {
                const res = await DataService.DeleteItemsFromCart(saasId, storeId, id, itemid);
                if (res.data.status) {
                    getCart();
                    // dispatch({ type: 'DELETE_ITEM', payload: { itemid } });
                }
            } catch (error) {
                console.error('Failed to delete item:', error);
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = localCart.filter(item => item.id !== itemid);
            console.log("called" , updatedCart)
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            dispatch({ type: 'DELETE_ITEM', payload: { itemid } });
        }
    };
    //Clear All Product
    const clearCart = async () => {
        if (id) {
            try {
                await DataService.DeleteAllItemsFromCart(saasId, storeId, id);
                dispatch({ type: 'SET_CART', payload: [] });
            } catch (error) {
                console.error('Failed to clear cart:', error);
            }
        } else {
            ClearLocalCart()
        }
    };
    
    const ClearLocalCart = ()=>{
        localStorage.removeItem('cart');
        dispatch({ type: 'SET_CART', payload: [] });
    }

    useEffect(() => {
        // if(id){
            getCart()
        // }
    }, [])
    

    return (
        <CartContext.Provider value={{ cart: state.cart, addItem, editItem, deleteItem ,getCart,clearCart,ClearLocalCart}}>
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