import { useAuth } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DataService from "../../services/requestApi";
import { BASEURL } from "../../services/http-Pos";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { Map, Phone } from "@mui/icons-material";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
const CheckoutPage = () => {
  const {
    authData,
    setIsPaymentSuccessful,
    login,
    isAuthenticated,
    getOrderHistory,
    getLocation,
    location,
    getaddress,
    getLocationAndOpenMaps
  } = useAuth();
  const { cart, clearCart, totalPricePlusDeliveryCharge ,ClearLocalCart} =
    useCart();
const totalPrice = cart && cart?.reduce((total, product) => {
    return total + product.new_price * product.product_qty;
  }, 0)
const TotalOrderQeuntity = cart && cart.reduce((total, item) => {
    return total + item.product_qty;
}, 0);
  const navigate = useNavigate();
  const { id,  mobileNumber, name } = authData;
  const selectedStore = localStorage.getItem('selectedStore');
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const { saasId, storeId,store_logo,store_name,address,phone_no,country ,key_id,storeType} = parsedStore || {};
  const [billingAddress, setBillingAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery')
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  useEffect(() => {
    if (showNewAddressForm) {
      setSelectedAddress(null);
    }
  }, [showNewAddressForm]);
  const handlePaymentChange = (type) => {
    setSelectedMethod(type);
    console.log(selectedMethod);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    reset
  } = useForm({defaultAddress});

  const handleAddressSelect = (id) => {
    setSelectedAddress(id);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully.");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createRazorpayOrder = async () => {
    try {
      const data = {
        amount: totalPrice ,
        currency: "INR",
      };

      const authHeader = `Basic ${btoa(
        "rzp_live_CJwPNN6lM1QV1v:7NMwsWRrzZqXPo9k78fEz7hf"
      )}`;

      const response = await axios.post(
        `${BASEURL.ENDPOINT_URL}rezar/pay/${Math.floor(data.amount)}/${storeId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (formData) => {
    try {
      const res = await createRazorpayOrder(); // Ensure this function works correctly
      console.log("Response from createRazorpayOrder:", res);
  
      if (res.status === "created") {
        const options = {
          key: key_id || "rzp_test_USk6kNFvt2WXOE",
          amount: res.amount, // Amount in paise
          currency: "INR",
          name: "Food4You",
          receipt: "receipt_id_123",
          payment_capture: 1,
          description: "Test Transaction",
          image: "", // Add a valid image URL if needed
          order_id: res.id, // Ensure this is valid
          handler: async function (response) {
            console.log("Payment handler response:", response);
            await handlePlaceOrder(formData, response);
            setIsPaymentSuccessful(true);
            clearCart();
            navigate("/cart/checkout/summary");
          },
          prefill: {
            name: `${formData.first_name} ${formData.last_name}`,
            email: formData.email,
            contact: formData.Mobile_numbers,
          },
          notes: {
            address: formData["Street Address"],
          },
          theme: {
            color: "#003f62",
          },
        };
  
        console.log("Razorpay options:", options);
  
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Error handling Razorpay payment:", error);
    }
  };

  const deleteAddress = async (id, saasId, storeId) => {
    try {
      const response = await DataService.DeleteAddress(id, saasId, storeId);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    if(!data.address_id ){
      console.log(data.address_id);
       setSnackbar({
        open: true,
        message: "Please select an address",
        severity: "error",
      });
      return;
    }
      handleRazorpayPayment(data);
  };
  
  const onCodSubmit = async (data,paymentResponse) => {
    try {
      if(!data.address_id && deliveryMethod == "Delivery"){
        console.log(data.address_id);
         setSnackbar({
          open: true,
          message: "Please select an address",
          severity: "error",
        });
        return;
      }
      const updatedCart = cart.map((item) => ({ ...item, productQty: 0 }));
      if(updatedCart?.length == 0 ){
        setSnackbar({
          open: true,
          message: "Cart is empty",
          severity: "error",
        });
        return;
      }
      setIsLoading(true)
       const orderInformations = {
        address_id: data.address_id,
        customer_id: id,
        customer_name: name,
        mobile_number: mobileNumber,
        saas_id: saasId,
        store_id: storeId,
        order_tax: 0,
        order_value: totalPrice,
        order_discount: 0,
        status: "pending",
        payment_type: selectedMethod,
        order_qty: TotalOrderQeuntity,
        razorpay_order_id: selectedMethod === "online" ? paymentResponse.razorpay_order_id : "",
        razorpay_payment_id: selectedMethod === "online" ? paymentResponse.razorpay_payment_id : "",
        order_date: new Date(),
        order_type: "Online",
        item_list: updatedCart,
      };
  
      // If storeType is "multichanel", group items by saas_id and store_id
      let finalOrder = [];
      if (storeType === "multichanel") {
        const groupedOrders = cart.reduce((acc, item) => {
          const key = `${item.saas_id}-${item.store_id}`;
          if (!acc[key]) {
            acc[key] = {
              saas_id: item.saas_id,
              store_id: item.store_id,
              order_tax: 0, // Update if needed
              order_value: 0,
              order_discount: 0,
              status: "pending",
              payment_type: selectedMethod,
              razorpay_order_id: selectedMethod === "online" ? paymentResponse.razorpay_order_id : "",
              razorpay_payment_id: selectedMethod === "online" ? paymentResponse.razorpay_payment_id : "",
              wallet_balance: 309, // Adjust if needed
              item_list: [],
            };
          }
  
          // Format item structure
          const formattedItem = {
            item_id: item.item_id,
            item_name: item.item_name,
            description: item.description || item.item_name,
            price: item.price || 0,
            price_pcs: item.price_pcs || null,
            product_qty: item.productQty,
            discount: item.discount || 0,
            tax: item.tax || null,
            tax_percent: item.tax_percent || 0,
            status: item.status || null,
            category: item.category || "",
            saas_id: item.saas_id,
            store_id: item.store_id,
            promo_id: item.promo_id || null,
            image_name: item.image_name || null,
            hsn_code: item.hsn_code || null,
            tax_rate: item.tax_rate || 0,
            barcode: item.barcode || null,
            supplier_name: item.supplier_name || "",
            opening_qty: item.opening_qty || 0,
            received_qty: item.received_qty || null,
            sold_qty: item.sold_qty || null,
            closing_qty: item.closing_qty || null,
            product_cost: item.product_cost || null,
            product_price: item.product_price || null,
            product_av_cost: item.product_av_cost || null,
            mrp: item.mrp || null,
            sku: item.sku || null,
            bill_qty: item.bill_qty || 0,
            name: item.item_name,
            new_price: item.newPrice || item.price,
            discount_menu_is_open: null,
            discount_value: null,
            amount_value: null,
            zero_price: null,
            finalDisc: 0,
            gram: item.UOM || 1000,
          };
  
          acc[key].item_list.push(formattedItem);
          acc[key].order_value += formattedItem.price * formattedItem.product_qty;
          acc[key].order_discount += formattedItem.discount;
  
          return acc;
        }, {});
  
        finalOrder = Object.values(groupedOrders);
      }
  
      // Store data in local storage
      localStorage.setItem("orderInformations", JSON.stringify(cart));
  
      // Condition to determine which order structure to send
      const response = storeType === "multichanel" ? await DataService.CreateOrderforMultiChannel(id,data.address_id,finalOrder) : await DataService.CreateOrder( orderInformations);

      localStorage.setItem("orderMaster", JSON.stringify(response.data));
      console.log("Order placed:", response);

      if (response.status === 200) {
        console.log("Order placed");
        await getOrderHistory(storeId,saasId,id);

        clearCart();
        setIsPaymentSuccessful(true);
        navigate("/cart/checkout/summary");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (data) => {
    const addressForSave = {
      address: `${data.street},${data.city},${data.state}`,
      address_type: data.address_type,
      street: data.street,
      store_id: storeId,
      saas_id: saasId,
      pincode: data.zipcode,
      city: data.city,
      state: data.state,
      status: "Active",
      customer_type: "Regular",
      latitude: location.latitude,
      longitude: location.longitude,
    };

    await saveAddress(addressForSave);
  };
  const [customerName, setCustomerName] = useState();
  const handlePlaceOrder = async (data, paymentResponse) => {
    try {
      const updatedCart = cart.map((item) => ({ ...item, productQty: 0 }));
      if (updatedCart?.length === 0) {
        setSnackbar({
          open: true,
          message: "Cart is empty",
          severity: "error",
        });
        return;
      }
  
      // Standard order structure (for non-multichanel stores)
      const orderInformations = {
        address_id: data.address_id,
        customer_id: id,
        customer_name: name,
        mobile_number: mobileNumber,
        saas_id: saasId,
        store_id: storeId,
        order_tax: 0,
        order_value: totalPrice,
        order_discount: 0,
        status: "pending",
        payment_type: selectedMethod,
        order_qty: TotalOrderQeuntity,
        razorpay_order_id: selectedMethod === "online" ? paymentResponse.razorpay_order_id : "",
        razorpay_payment_id: selectedMethod === "online" ? paymentResponse.razorpay_payment_id : "",
        order_date: new Date(),
        order_type: "Online",
        item_list: updatedCart,
      };
  
      // If storeType is "multichanel", group items by saas_id and store_id
      let finalOrder = [];
      if (storeType === "multichanel") {
        const groupedOrders = cart.reduce((acc, item) => {
          const key = `${item.saas_id}-${item.store_id}`;
          if (!acc[key]) {
            acc[key] = {
              saas_id: item.saas_id,
              store_id: item.store_id,
              order_tax: 0, // Update if needed
              order_value: 0,
              order_discount: 0,
              status: "pending",
              payment_type: selectedMethod,
              razorpay_order_id: selectedMethod === "online" ? paymentResponse.razorpay_order_id : "",
              razorpay_payment_id: selectedMethod === "online" ? paymentResponse.razorpay_payment_id : "",
              wallet_balance: 309, // Adjust if needed
              item_list: [],
            };
          }
  
          // Format item structure
          const formattedItem = {
            item_id: item.item_id,
            item_name: item.item_name,
            description: item.description || item.item_name,
            price: item.price || 0,
            price_pcs: item.price_pcs || null,
            product_qty: item.productQty,
            discount: item.discount || 0,
            tax: item.tax || null,
            tax_percent: item.tax_percent || 0,
            status: item.status || null,
            category: item.category || "",
            saas_id: item.saas_id,
            store_id: item.store_id,
            promo_id: item.promo_id || null,
            image_name: item.image_name || null,
            hsn_code: item.hsn_code || null,
            tax_rate: item.tax_rate || 0,
            barcode: item.barcode || null,
            supplier_name: item.supplier_name || "",
            opening_qty: item.opening_qty || 0,
            received_qty: item.received_qty || null,
            sold_qty: item.sold_qty || null,
            closing_qty: item.closing_qty || null,
            product_cost: item.product_cost || null,
            product_price: item.product_price || null,
            product_av_cost: item.product_av_cost || null,
            mrp: item.mrp || null,
            sku: item.sku || null,
            bill_qty: item.bill_qty || 0,
            name: item.item_name,
            new_price: item.newPrice || item.price,
            discount_menu_is_open: null,
            discount_value: null,
            amount_value: null,
            zero_price: null,
            finalDisc: 0,
            gram: item.UOM || 1000,
          };
  
          acc[key].item_list.push(formattedItem);
          acc[key].order_value += formattedItem.price * formattedItem.product_qty;
          acc[key].order_discount += formattedItem.discount;
  
          return acc;
        }, {});
  
        finalOrder = Object.values(groupedOrders);
      }
  
      // Store data in local storage
      localStorage.setItem("orderInformations", JSON.stringify(cart));
  
      // Condition to determine which order structure to send
      const response = storeType === "multichanel" ? await DataService.CreateOrderforMultiChannel(id,data.address_id,finalOrder) : await DataService.CreateOrder( orderInformations);
  
      localStorage.setItem("orderMaster", JSON.stringify(response.data));
      console.log("Order placed:", response);
  
      if (response.status === 200) {
        console.log("Order placed successfully");
        await getOrderHistory(storeId, saasId, id);
        clearCart();
        setIsPaymentSuccessful(true);
        navigate("/cart/checkout/summary");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  console.log(cart);
  const saveAddress = async (data) => {
    try {
      const response = await DataService.SaveAddress(data, id);
      console.log("Address saved:", response);
      setShowNewAddressForm(false);
      getSavedData(); // Refresh the saved addresses list
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const getSavedData = async () => {
    try {
      const response = await DataService.GetSavedAddress(id, saasId, storeId);
      setSavedAddresses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedAddress(response.data.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching saved addresses:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getSavedData();
    }
  }, [id]);

  const handleClose = () => {
    document.getElementById("my_modal_5").close();
    navigate("/cart/checkout/summary");
  };

  // autenticationPart

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [Existuser, setExistUser] = useState(false);
  const [otp, setOtp] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  const onSubmitFirstStep = async (data) => {
    if ( country !== "Canada" && data.mobile_number?.length !== 10) {
      console.log(data.mobile_number?.length, data.mobile_number)
      setSnackbar({
        open: true,
        message: "Phone number must be 10 digits!",
        severity: "error",
      });
      return;
    }
    setIsLoading(true);
    try {
      const checkCountry = country == "Canada"? data.email :data.mobile_number
      setEmail(checkCountry);
      const response = await axios.get(
        `${BASEURL.ENDPOINT_URL}otp/resend-otp/${checkCountry}/${storeId}`
      );

      if (response.data.status) {
        if(response.data.message === "Already Registered"){
          setExistUser(true);
        }
        setSnackbar({
          open: true,
          message: "OTP sent successfully!",
          severity: "success",
        });
        setIsLoading(false);
        setStep(2);
    
      }else{
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: response?.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.data?.message == "User Already Registered") {
        setSnackbar({
          open: true,
          message: "User Already Registered!",
          severity: "error",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: "Error resending OTP. Please try again later.",
          severity: "error",
        });
      }
    }
  };

  const onSubmitSecondStep = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASEURL.ENDPOINT_URL}otp/validate-otp`,
        {
          mobile_no: email,
          otp: data.otp,
        }
      );
      if (response.data.status ) {
        if(Existuser){
          handleLoginSubmit(response?.data?.password);
        }else{
          setIsLoading(false);
          setSnackbar({
            open: true,
            message: "OTP validated successfully!",
            severity: "success",
          });
          setStep(3);
        }

      }else{
        setIsLoading(false);
        setSnackbar({
          open:true,
          message:response.data.message,
          severity:"error"
        })
      }
    } catch (error) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to validate OTP.",
        severity: "error",
      });
    }
  };

  const onSubmitThirdStep = async (data) => {
    if (data.password !== data.confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }
     setIsLoading(true);
    const today = new Date();
    const currentDate = today.toLocaleDateString();

    try {
      const response = await axios.post(
        `${BASEURL.ENDPOINT_URL}customer/create`,
        {
          sub_centre_id: 1,
          mobile_number:data.mobile_number,
          password: data.password,
          address_3: "Building 5",
          discount_percent: 10.0,
          email:email,
          name: `${data.first_name} ${data.last_name}`,
          card_number: Math.ceil(Math.random() * 10000),
          store_id: storeId,
          saas_id: saasId,
          city: "city",
          state: "state",
          country: "India",
          preferred_language: "English",
          customer_since: currentDate,
          payment_terms: 30,
          credit_limit: 10000.0,
          sales_representative: "Jane Smith",
          gender: "male",
          occupation: "occ",
          income_level: 50000,
          source_of_acq: "online",
          customer_type: "CUSTOMER",
        }
      );
      if (response.data.status ) {
        setCustomerName(data.first_name, data.last_name);
        setSnackbar({
          open: true,
          message: "Registration successful!",
          severity: "success",
        });
        // Registration successful, handle next steps
        handleLoginSubmit(data.password);
      }else{
        setStep(1)
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      setStep(1)
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to register.",
        severity: "error",
      });
    }
  };

  const handleLoginSubmit = async (password) => {
    try {
      const response = await axios.post(
        `${BASEURL.ENDPOINT_URL}auth/user-login`,
        {
          user_name: email,
          password: password,
        }
      );
    //   const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (response.data.status) {
        setIsLoading(false);
        const token = response.data.data.jwt_response;
        const user = response.data.data.customer_data;
        // Handle login success, e.g., store token, navigate to dashboard, etc.
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });

        if (token && user) {
          login(user, token);
            setTimeout(() => {
              navigate('/');
              ClearLocalCart()
            }, 1000);
          
        }
      } else {
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: "Auto Login failed!",
          severity: "error",
        });
        // Handle login failure
      }
    } catch (error) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to login. Please try again later.",
        severity: "error",
      });
      // Handle error
    }
  };

  //fetching states:---
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          `https://countriesnow.space/api/v0.1/countries/states/q?country=${country}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify({
            //   country: "Canada",
            // }),
          }
        );
        const data = await response.json();
        console.log(data)
        setStates(data.data.states);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const GetCurrentaddress = async () => {
     await getLocation()
    console.log(getaddress )
   
    }

    useEffect(() => {
      if(getaddress){
        reset({
          street: getaddress.street,
          city: getaddress.town,
          state: getaddress.state,
          zipcode: getaddress.postalCode,
          // state: getaddress.Province,
          country: getaddress.country,
        })
      }
    }, [getaddress])
    
    const [copied, setCopied] = useState(false)
    const copyToClipboard = () => {
      navigator.clipboard.writeText(phone_no)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((error) => {
          console.error('Error copying text to clipboard:', error);
        });
    };
      // const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    
      
  return (
    <div className="w-full mx-auto p-4">
      {!isAuthenticated && (
        <div className="border border-gray-300 p-6 mb-6 rounded-md">
          <h2 className="text-lg font-semibold mb-4">Register Information</h2>

          {step === 1 && (
            <form
              onSubmit={handleSubmit(onSubmitFirstStep)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="form-group">
                <label htmlFor="firstName" className="text-sm font-semibold">
                  First Name
                </label>
                <input
                  {...register("first_name", { required: true })}
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.first_name && <span>This field is required</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="text-sm font-semibold">
                  Last Name
                </label>
                <input
                  {...register("last_name", { required: true })}
                  type="text"
                  id="lastName"
                  placeholder="Last name"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.last_name && <span>This field is required</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  {...register("email", { required: false })}
                  type="email"
                  id="phoneNumber"
                  placeholder="Enter email"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.email && <span>This field is required</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber" className="text-sm font-semibold">
                  Mobile Number
                </label>
                <input
                  {...register("mobile_number", { required: false })}
                  type="number"
                  id="mobile_number"
                  placeholder="Enter your mobile number"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.mobile_number && <span>This field is required</span>}
              </div>
              <button
              disabled={isLoading}
                type="submit"
                className=" h-12 mt-5 bg-second text-white text-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                {isLoading?"Otp sending...":"Next"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleSubmit(onSubmitSecondStep)}
              className="grid grid-cols-1 gap-4"
            >
              <span>Otp sent to your '{email}'</span>
              <div className="form-group">
                <label htmlFor="otp" className="text-sm font-semibold">
                  Enter OTP
                </label>
                <input
                  {...register("otp", { required: true })}
                  type="text"
                  id="otp"
                  placeholder="OTP"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.otp && <span>This field is required</span>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className=" h-12 mt-5 bg-second text-white text-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Validate OTP
              </button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={handleSubmit(onSubmitThirdStep)}
              className="grid grid-cols-1 gap-4"
            >
              <div className="form-group">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.password && <span>This field is required</span>}
              </div>
              <div className="form-group">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </label>
                <input
                  {...register("confirmPassword", { required: true })}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.confirmPassword && <span>This field is required</span>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="h-12 mt-5 bg-second text-white text-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Register
              </button>
            </form>
          )}

         
        </div>
      )}

      {showNewAddressForm && isAuthenticated ? (
        <div className="border border-gray-300 p-6 mb-6 rounded-md">
          <div className="flex ">
            
          <h3 className="text-primary uppercase font-medium text-sm">
            <span className="bg-light py-[1px] px-[3px] text-sm rounded-sm mr-1 ">
              1.2
            </span>{" "}
            add Delivery Address
          </h3> 
          <button
                  onClick={() => {GetCurrentaddress()}}
                  className=" font-bold text-green-500 text-lg font-semibold rounded px-2 hover:bg-yellow-600 transition-colors"
                  >
                  <GpsFixedIcon className="mx-2 text-green-500 hover:text-white"/>
                  Current Location
                </button>
                  </div>
         
          <form className="" onSubmit={handleSubmit(handleSaveAddress)}>
          
            <div className="grid gap-4 grid-cols-2 max-md:grid-cols-1 w-full">
              <div className="form-group ">
                <label
                  htmlFor="streetAddress"
                  className="text-sm font-semibold"
                >
                  Street Address *
                </label>
                <input
                  {...register("street", { required: true })}
                  type="text"
                  id="streetAddress"
                  placeholder="Street Address"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.street && <span>This field is required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="city" className="text-sm font-semibold">
                  Town / City *
                </label>
                <input
                  {...register("city", { required: true })}
                  type="text"
                  id="city"
                  placeholder="Town / City"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.city && <span>This field is required</span>}
              </div>
              <div className="form-group">
                <label htmlFor="state" className="text-sm font-semibold">
                {country =="India"?"State":"Province"}
                </label>
                <select
                  {...register("state", { required: true })}
                  id="state"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                >
                  <option value="">Select your {country =="India"?"State":"Province"}</option>
                  {states.map((state, index) => (
                    <option key={index} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <span className="text-red-500 text-xs">
                    This field is required
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="zipCode" className="text-sm font-semibold">
                  Postal Code
                </label>
                <input
                  {...register("zipcode", { required: true })}
                  type="number"
                  id="zipCode"
                  placeholder="Postal Code"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
                />
                {errors.zipcode && <span>This field is required</span>}
              </div>
              {/* <div className="form-group">
                <label htmlFor="zipCode" className="text-sm font-semibold">
                  Mobile Number
                </label>
                <input
                  {...register("mobail_number", { required: true })}
                  type="number"
                  id="mobail_number"
                  placeholder="Mobile Number"
                  className="bg-white mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                {errors.zipcode && <span>This field is required</span>}
              </div> */}
              <div className="form-group ">
                <label className="text-sm font-semibold">Address Type *</label>
                <div className="mt-2 flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      {...register("address_type", { required: true })}
                      type="radio"
                      value="Home"
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-gray-700">Home</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      {...register("address_type", { required: true })}
                      type="radio"
                      value="Work"
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-gray-700">Work</span>
                  </label>
                </div>
                {errors.address_type && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </div>

              <span></span>
              <button
                type="submit"
                className="text-white border-[1px] border-gray-200 py-2 px-6 uppercase font-medium text-sm bg-second"
              >
                Save address
              </button>
              {savedAddresses?.length !== 0 && (
                <button
                  onClick={() => setShowNewAddressForm(false)}
                  className="w-full py-3 bg-second text-white text-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Use existing address
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <>
          {isAuthenticated && (
            <div className="border  gap-4 border-gray-300 p-6 mb-6 rounded-md">
              <div className="flex justify-between items-center max-sm:flex-col max-sm:w-full">
                <h3 className="text-primary uppercase font-medium text-sm">
                  <span className="bg-light py-[1px] px-[3px] text-sm rounded-sm mr-1 ">
                    1
                  </span>{" "}
                  {deliveryMethod === 'Delivery' ? 'SELECT ADDRESS' : 'Store address'}
                </h3>{" "}
                <div className="flex rounded-full bg-gray-200 text-sm my-2">
              <button
                className={`px-4 py-2 rounded-full ${deliveryMethod === 'Delivery' ? 'bg-primary text-white' : ''}`}
                onClick={() => setDeliveryMethod('Delivery')}
              >
                Delivery
              </button>
              <button
                className={`px-4 py-2 rounded-full ${deliveryMethod === 'Pickup' ? 'bg-primary text-white' : ''}`}
                onClick={() => setDeliveryMethod('Pickup')}
              >
                Pickup
              </button>
            </div>
              </div>
              { deliveryMethod === 'Delivery' ?<div>
                <button
                  className="text-primary border-[1px] border-gray-200 py-2 px-6 uppercase font-medium text-sm hover:bg-gray-100  max-sm:w-full mt-2"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  Add New Address
                </button>
              {savedAddresses.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="mx-auto flex flex-col md:flex-row w-full justify-between rounded-xl p-4 my-2 bg-[#E0F4FF] text-primary"
                  >
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                        <input
                          type="radio"
                          id={`address_${index}`}
                          {...register("address_id", { required: true })}
                          value={item.id.toString()}
                          checked={selectedAddress === item.id}
                          onChange={() => handleAddressSelect(item.id)}
                          className="accent-[#F1A10A] h-5 w-5 mt-1 md:mt-0"
                        />
                        <span className="text-lg font-semibold ml-2">
                          {item.address}
                        </span>
                        <span
                          className={`ml-2 ${
                            item.addressType === "Home"
                              ? "bg-second"
                              : "bg-primary"
                          } text-white text-xs font-semibold rounded px-2 py-1`}
                        >
                          {item.addressType}
                        </span>
                      </div>

                      <p className="text-sm">
                        <span className="font-semibold">
                          PinCode: {item.pincode}
                        </span>
                      </p>
                    </div>
                    {/* <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={() => deleteAddress(item.id, saasId, storeId)}
                        className="text-[#0A66C2]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div> */}
                  </div>
                );
              })}
              </div>:<><div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-6">
                <img
                  src={store_logo}
                  alt="Various food dishes"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{store_name}</h1>
                <p className="text-gray-600 flex items-start sm:items-center flex-col sm:flex-row">
                  <Map className="w-5 h-5 mr-2 mb-2 sm:mb-0" />
                  <span>{address}</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span className="font-semibold text-lg">{phone_no}</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center text-primary hover:text-primary-dark transition-colors duration-200"
                >
                  <FileCopyIcon className="w-5 h-5 mr-2" />
                  {copied ? 'Copied!' : 'Copy number'}
                </button>
                <button
                  onClick={getLocationAndOpenMaps}
                  className="flex items-center text-primary hover:text-primary-dark transition-colors duration-200"
                >
                  <DirectionsWalkIcon className="w-5 h-5 mr-2" />
                  Directions
                </button>
              </div></>}
            </div>
          )}
        </>
      )}

      {!showNewAddressForm && isAuthenticated? (
        <div className="p-4 border-[1px] rounded-md">
          <h3 className="text-primary uppercase font-medium text-sm">
            <span className="bg-light py-[1px] px-[3px] text-sm rounded-sm mr-1 ">
              2
            </span>{" "}
            Payment Option
          </h3>
          <div
            onClick={() => handlePaymentChange("online")}
            className={`mt-2 p-4  rounded-md flex gap-2 items-center bg-light `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked ={selectedMethod === "online"}
              onChange={() => handlePaymentChange("online")}
              className="mr-2 bg-[#00B207] text-[#00B207]"
            />
            <h3 className="font-semibold text-[#4D4D4D]  ">Pay online</h3>
          </div>
          <div
            onClick={() => handlePaymentChange("COD")}
            className={`mt-2 p-4  rounded-md flex gap-2 items-center bg-light `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked ={selectedMethod === "COD"}
              onChange={() => handlePaymentChange("COD")}
              className="mr-2 bg-[#00B207] text-[#00B207]"
            />
            <h3 className="font-semibold text-[#4D4D4D]  ">Cash On Delivery</h3>
          </div>
          {selectedMethod == "online"? <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full mt-4 py-2 bg-[#00B207] text-white rounded-full text-lg  hover:bg-[#017f05]transition-colors mx-auto"
          >
            Pay and Place Order
          </button>:
          
          <button
            onClick={handleSubmit(onCodSubmit)}
            disabled={isLoading}
            className="w-full mt-4 py-2 bg-[#00B207] text-white rounded-full text-lg  hover:bg-[#017f05]transition-colors mx-auto"
          >
           {isLoading?"Order Booking..." :"Place Order"}
          </button>}
          
        </div>
      ) : (
        ""
      )}

      <dialog id="my_modal_5" className=" modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-dark shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="font-bold text-lg ml-4">Order Successful!</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Your order has been placed successfully. Our team will reach out to
            you shortly with the next steps.
          </p>

          <div className="modal-action">
            <a
              href="tel:+917755821175"
              className="bg-green-500 text-white p-2 rounded-lg font-semibold inline-block"
            >
              Call us!
            </a>

            <button
              className=" bg-white text-dark p-2 rounded-lg font-semibold"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
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

export default CheckoutPage;
