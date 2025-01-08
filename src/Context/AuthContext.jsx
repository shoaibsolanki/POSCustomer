import React, { createContext, useState, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [address, setAddress] = useState({
    postalCode: null,
    route: null,
    town: null,
    street: null,
    Province: null,
    error: null,
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
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
        // Set the address and log the postal code
        // setAddress(formattedAddress);
        // console.log("Formatted Address:", addressComponents.find(component =>
        //   component.types.includes('route')
        // ).long_name);
        // console.log("Postal Code:", PostalCode);
        // console.log("Postal Code:", Route);
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

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, getLocation,address }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
