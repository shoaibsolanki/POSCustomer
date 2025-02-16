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
                item.id === action.payload.id ? { ...item, product_qty: action.payload.product_qty } : item
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
            const updatedData = data.map(item => ({
                ...item,
                saas_id: item.saasId,
                store_id: item.storeId,
                item_name:item.itemName
            }));
            dispatch({ type: 'SET_CART', payload: updatedData });
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
        console.log(item)
        if (id) {
            const payload = {
                item_id: item.item_id,
                item_name: item.item_name,
                category: item.category,
                message: "This is an example cart item.",
                itemCode: item.item_code || null,
                sku: "SKU123", // Assuming SKU is static or fetched separately
                description: item.description,
                price: item.price,
                mrp:  item.actual_price, // Default to actual price if MRP is missing
                new_price: item.selectedUom? Number(item.price) * Number(item.selectedUom):item.price,
                discount: item.discount,
                status: item.status,
                department: item.dept || "no departments",
                saas_id: item.saas_id,
                store_id: item.store_id,
                promoId: item.promo_id,
                item_quantity: item.product_qty,
                gram: item.selectedUom ? `${parseFloat(item.selectedUom) * 1000}` : "1000", // Convert UOM to grams
                hsnCode: item.hsn_code,
                taxRate: item.tax_rate,
                taxCode: item.tax_code,
                taxPercent: item.tax_percent,
                actual_price: item.actual_price
            }
             
            // if (item.selectedUom) {
            //     item.new_price = Number(item.price) * Number(item.selectedUom);
            // }
            const response = await DataService.AddItemsToCart(payload, saasId, storeId, id);
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
                const newItem = { ...item, id: Date.now(), new_price :item.selectedUom ?(Number(item.price) * Number(item.selectedUom)):item.price };
                console.log(newItem)
                localCart.push(newItem);
                dispatch({ type: 'ADD_ITEM', payload: newItem });
                localStorage.setItem('cart', JSON.stringify(localCart));
            }

        }
    };
    const editItem = async (qty, itemid) => {
        if (qty < 1) {
            return;
        }
        if (id) {
            try {
                const response = await DataService.UpdateCartitem(qty, saasId, storeId, id, itemid);
                if (response.data.status) {
                    getCart();
                    // dispatch({ type: 'EDIT_ITEM', payload: item });
                }
            } catch (error) {
                console.error('Failed to update item:', error);
            }
        } else {
            
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = localCart.map(item => 
                item.id === itemid ? { ...item, product_qty: qty } : item
            );
            console.log("called", updatedCart , itemid , qty)
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            dispatch({ type: 'EDIT_ITEM', payload: { id: itemid, product_qty: qty } });
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