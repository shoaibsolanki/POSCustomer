import React, { createContext, useState, useContext, useEffect } from "react";
import DataService from "../services/requestApi";
import { useNavigate } from "react-router-dom";
// Create a context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [selectedsubcat, setSelectedsubCat] = useState("");
  const navigate = useNavigate()
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState( JSON.parse(localStorage.getItem("authData")));
  const [authData, setAuthData] = useState(() => {
    const storedAuthData = JSON.parse(localStorage.getItem("authData"));
    if (storedAuthData) {
      return storedAuthData;
    } else {
      return { token: null, user: null };
    }
  });
  const [allOrders, setAllOrders] = useState([]); 
  const [store, setStores] = useState([]);
  const [getaddress, setAddress] = useState({
    postalCode: null,
    route: null,
    town: null,
    street: null,
    Province: null,
    error: null,
  });
  const selectedStore = localStorage.getItem("selectedStore");
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const { saasId, storeId , storeType } = parsedStore || {};
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState();
  const [page, setPage] = useState(1);
  useEffect(() => {
    const storedAuthData = JSON.parse(localStorage.getItem("authData"));
    if (storedAuthData) {
      setAuthData(storedAuthData);
    }
  }, []);

  const login = (data, token) => {
    setAuthData(data);
    setIsAuthenticated(data)
    localStorage.setItem("authData", JSON.stringify(data));
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    console.log("Logged Out");
    setAuthData();
    localStorage.removeItem("authData");
    localStorage.clear();
    navigate("/login")
  };
  const GetAddressByCoordinates = async (latitude, longitude) => {
    try {
      const GOOGLE_API_KEY = "AIzaSyC9AHMzRRjBrAhpqI1m2xErTCH_3h-kLlE"; // Replace with your actual Google Maps API key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        // Extract the formatted address
        const formattedAddress = data.results[0].formatted_address;

        // Extract postal code from address components
        const addressComponents =
          (await data.results.find((component) =>
            component.types.includes("route")
          )?.address_components) || "Postal code not found";
        const PostalCode =
          (await addressComponents.find((component) =>
            component.types.includes("postal_code")
          )?.long_name) || "Postal code not found";
        const Route =
          (await data.results.find((component) =>
            component.types.includes("route")
          )?.formatted_address) || "Route not found";
        setAddress({
          postalCode: PostalCode,
          route: Route,
          town: addressComponents.find(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("political")
          ).long_name,
          street: addressComponents.find((component) =>
            component.types.includes("route")
          ).long_name,
          Province: addressComponents.find((component) =>
            component.types.includes("administrative_area_level_1")
          ).long_name,
          error: null,
        });
      } else {
        console.error("No address found for the given coordinates.");
        setAddress({
          postalCode: null,
          route: null,
          town: null,
          street: null,
          Province: null,
          error: "No address found for the given coordinates.",
        });
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress({
        postalCode: null,
        route: null,
        town: null,
        street: null,
        Province: null,
        error: "Error fetching address.",
      });
    }
  };
  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await GetAddressByCoordinates(latitude, longitude);
          setLocation({
            latitude: latitude,
            longitude: longitude,
            error: null,
          });
          // console.log(latitude, longitude)
        },
        (error) => {
          setLocation({ ...location, error: error.message });
        },
        {
          enableHighAccuracy: true, // Use high accuracy mode for better results
        }
      );
    } else {
      setLocation({
        ...location,
        error: "Geolocation is not supported by this browser.",
      });
    }
  };

  const DataByCatogory = async () => {
    try {
      if(!selectedsubcat)return
      var response = []
      if(storeType == "multichanel"){
        response = await DataService.GetItemByCatogoryBysaasid(
          saasId,
          selectedsubcat,
          page
        );

      }else{
        response = await DataService.GetItemByCatogory(
          saasId,
          storeId,
          selectedsubcat,
          page
        );
      }
      console.log(response);
  
      if (response.data.status) {
        const newProducts = response.data.data.map((item) => ({
          ...item,
          new_price: item.price,
        }));
      if(page == 1){
      setProducts(newProducts)
      }else{
        setProducts((prevProducts) => [...prevProducts, ...newProducts]); // Append new data
      }
        // Check if there are more products to load
        // const isLastPage = ; 
        const isLastPage = response.data.next === null;
        setHasMore(!isLastPage); // Set `hasMore` to `false` if it's the last page
        setPage((prevPage) => prevPage + 1);
        if(isLastPage){
          setPage(1)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
   

  const getOrderHistory = async (store_id, saas_id, id) => {
    try {
      const response = await DataService.OrderHistory(store_id, saas_id, id);
      const reversedOrders = response.data.data.slice().reverse();
      setAllOrders(reversedOrders);
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(allOrders);
  const id = authData?.id;
  useEffect(() => {
    if(id){
      getOrderHistory(storeId , saasId, id);
    }
  }, [id]);

  
  
  return (
    <AuthContext.Provider
      value={{
        DataByCatogory,
        selectedsubcat,
        setSelectedsubCat,
        page,
        setPage,
        hasMore,
        products,
        setHasMore,
        setProducts,
        setStores,
        store,
        isAuthenticated,
        login,
        logout,
        getLocation,
        location,
        getaddress,
        authData,
        getOrderHistory,
        allOrders,
        setIsPaymentSuccessful,
        isPaymentSuccessful,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
