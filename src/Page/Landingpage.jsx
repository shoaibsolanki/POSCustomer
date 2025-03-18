import React, { useEffect, useRef, useState } from "react";
import bgimage from "../assets/landingbg.png";
import logo from "../assets/ladingimg.png";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { useNavigate } from "react-router-dom";
import DataService from "../services/requestApi";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchableSelect from "../Componenets/SearchableSelect";
import { Alert, Snackbar, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "../Context/AuthContext";

const Landingpage = () => {
  const navigate = useNavigate();
  const [Address, setGetAddress] = React.useState("");
  const { getLocation, getaddress, setStores } = useAuth();
  const selectedStore = localStorage.getItem("selectedStore");
  const dropdownRef = useRef(null);
  const [type, setType] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  const GetStorebyAddress = async () => {
    if (!type) {
      setSnackbar({
        open: true,
        message: "Please select a type",
        severity: "error",
      });
      return;
    }
    console.log(Address);
    localStorage.setItem("deliveryAddress", Address.value);
    try {
      const response = await DataService.GetStoreByAddress(Address.value);
      console.log(response);
      if (response.data.data.length > 0) {
        navigate("/stores");
      } else {
        setSnackbar({
          open: true,
          message: "Please select a Correct Address",
          severity: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetCurrentaddress = async () => {
    await getLocation();
  };

  const handleStorebyPin = async () => {
    try {
      localStorage.setItem("pinCode", pinCode);
      const response = await DataService.GetStoreByPinCode(pinCode);
      console.log(response);
      if (response.data.data) {
        const filteredStores = response.data.data.filter(store => store.empId === "Online");
        console.log("filtered data", filteredStores);
        setStores(filteredStores);
        if (filteredStores.length > 0) {
          if(filteredStores.length === 1){
            localStorage.setItem("selectedStore", JSON.stringify(filteredStores[0]));
            navigate("/");
          }else{
            navigate("/stores");
          }
        } else {
          setSnackbar({
            open: true,
            message: "At This Time No Store Found on Your Location",
            severity: "error",
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: "At This Time No Store Found on Your Location",
          severity: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (getaddress?.postalCode) {
      console.log("address is coming");
      handleStorebyPin();
    }
  }, [getaddress]);

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimage})`, backgroundColor: 'white' }}
    >
      <div className="absolute inset-0 opacity-100"></div>
      <div className="relative flex flex-col items-center justify-center h-full text-white">
        <img src={logo} alt="Food 4 You Logo" className="mb-8" />
        <h1 className="text-3xl font-bold mb-4">Discover Store Near You</h1>
        <div className="w-full max-w-md px-4 flex flex-col items-center gap-2">
          {/* <button
            onClick={() => GetCurrentaddress()}
            style={{
              fontFamily: "Inter",
            }}
            className="w-[380px] px-1 mb-2 py-1 bg-black text-white rounded font-bold flex justify-center items-center"
          >
            <LocationOnIcon className="mx-1 text-white" />
            By Current Location
          </button> */}
          <TextField
            label="Enter Pin Code"
            variant="outlined"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            className="w-[380px] mb-2"
            InputProps={{
              style: { backgroundColor: 'white' },
            }}
          />
          <button
            onClick={() => handleStorebyPin()}
            style={{
              fontFamily: "Inter",
            }}
            className="w-[380px] px-1 py-1 bg-black text-white rounded font-bold flex justify-center items-center"
          >
            Find Store
          </button>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Landingpage;
