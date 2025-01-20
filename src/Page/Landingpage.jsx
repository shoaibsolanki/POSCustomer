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
import { Alert, Snackbar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "../Context/AuthContext";
const Landingpage = () => {
  const navigate = useNavigate();
  const [Address, setGetAddress] = React.useState("");
    const { getLocation,getaddress , setStores} = useAuth();
  const selectedStore = localStorage.getItem("selectedStore");
  // const [options, setOptions] = useState([]);
  // const [menuIsOpen, setMenuIsOpen] = useState(true);
  const dropdownRef = useRef(null);
  const [type, setType] = useState('')
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };
//   const GetAddress = async () => {
//     try {
//       const response = await DataService.getAddressofStores();
//       console.log(response);
//       const formattedOptions = response.data.data.map((item) => ({
//         value: item.saas_id, // You can change 'store_id' to any field you want as the value
//         label: `${item.getaddress}`, // Customize label as needed
//       }));
//       setOptions(formattedOptions);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   useEffect(() => {
//     GetAddress();
//   }, []);

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
          // setStores(response.data.data);
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
  // const onChange = (e) => {
  //   setGetAddress(e.target.value)

  // }
  const GetCurrentaddress = async () => {
    await getLocation()
    //  console.log(getaddress )
  };
  const handleStorebyPin = async () => {
    try {
        if (!type) {
            setSnackbar({
              open: true,
              message: "Please select a type",
              severity: "error",
            });
            return;
          }

        const response = await DataService.GetStoreByPinCode(getaddress?.postalCode,type);
      console.log(response);
      if(response.data.data.length > 0){
        setStores(response.data.data)
        navigate("/stores");
      }else{
        setSnackbar({
          open: true,
          message: "At This Time No Store Found on Your Location",
          severity: "error",
        });
      }
      // const formattedOptions = response.data.data.map((item) => ({
      //   value: item.storeId, // You can change 'store_id' to any field you want as the value
      //   label: `${item.getaddress}`, // Customize label as needed
      // }));
      // setOptions(formattedOptions);
      // Focus the dropdown after setting options
      // if (dropdownRef.current) {
      //   setMenuIsOpen(true);
      //   dropdownRef.current.focus();
      // }
    } catch (error) {
      console.log(error);
    }
  };

     useEffect(() => {
      if(getaddress?.postalCode){
        console.log("addres is comming")
        handleStorebyPin()
      }

     }, [getaddress])

return (
    <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimage})`, backgroundColor: 'white' }}
    >
        <div className="absolute inset-0  opacity-100"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-white">
            <img src={logo} alt="Food 4 You Logo" className="mb-8" />
            {/* <div style={{ backgroundColor: 'black', padding: '20px', minHeight: '100vh' }}> */}
            <h1 className="text-3xl font-bold mb-4">Select Store</h1>
      <FormControl className="w-[380px]">
        <InputLabel
          id="demo-simple-select-label"
          sx={{ color: 'black' }} // Label text color
        >
          Select Store
        </InputLabel>
        <Select
        onChange={(e)=>{setType(e.target.value)}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          aria-placeholder="Select Store"
          sx={{
            color: 'black', // Selected text color
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Border color
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Border color on focus
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Border color on hover
            },
            '.MuiSvgIcon-root': {
              color: 'white', // Dropdown arrow color
            },
            backgroundColor: 'white', // Dropdown background color
          }}
        >
          <MenuItem value="VEGETABLE" sx={{ color: 'black', backgroundColor: 'white' }}>
          VEGETABLE
          </MenuItem>
          <MenuItem value="GROCERY" sx={{ color: 'black', backgroundColor: 'white' }}>
          GROCERY
          </MenuItem>
          <MenuItem value="MEDICAL" sx={{ color: 'black', backgroundColor: 'white' }}>
          MEDICAL
          </MenuItem>
          <MenuItem value="SWEET" sx={{ color: 'black', backgroundColor: 'white' }}>
          SWEET
          </MenuItem>
          <MenuItem value="FASHION" sx={{ color: 'black', backgroundColor: 'white' }}>
          FASHION
          </MenuItem>
          <MenuItem value="SALOON" sx={{ color: 'black', backgroundColor: 'white' }}>
          SALOON
          </MenuItem>
        </Select>
      </FormControl>
    {/* </div> */}
            <h1 className="text-3xl font-bold mb-4">Order delivery near you</h1>
            <div className="w-full max-w-md px-4 flex justify-center ">
                <button
                    onClick={() => GetCurrentaddress()}
                    style={{
                        fontFamily: "Inter",
                    }}
                    className="w-[380px] px-1 mb-2 py-1 bg-black text-white rounded font-bold flex justify-center items-center"
                >
                    <LocationOnIcon className="mx-1 text-white" />
                    By Current Location
                </button>
                {/* <div className="flex justify-between gap-2">
                    <SearchableSelect
                        menuIsOpen={menuIsOpen}
                        dropdownRef={dropdownRef}
                        options={options}
                        Address={Address}
                        onChange={setGetAddress}
                    />
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => GetStorebyAddress()}
                            style={{
                                fontFamily: "Inter",
                            }}
                            className="px-4 py-1 bg-black text-white rounded font-bold"
                        >
                            Find Store
                        </button>
                    </div>
                </div> */}
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
