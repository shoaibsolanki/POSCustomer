import { ArrowLeft, ArrowRight, Map } from "@mui/icons-material";
import { useAuth } from "../../Context/AuthContext";
import Item from "./items";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Phone } from "@mui/icons-material";
// import { MapPin } from "@phosphor-icons/react";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { Button, CircularProgress } from "@mui/material";
import DataService from "../../services/requestApi";
// import Swal from "sweetalert2";

const Orders = ({ className = "" }) => {
  const { allOrders, getOrderHistory ,authData,getLocationAndOpenMaps} = useAuth();
  const selectedStore = localStorage.getItem('selectedStore');
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const {saasId, storeId, store_logo,store_name,address,phone_no} = parsedStore || {};
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const { id,  mobileNumber, name } = authData;
  const totalPages = Math.ceil(allOrders?.length / itemsPerPage);
  const [copied, setCopied] = useState(false)
  const [orderDetails, setOrderDetails] = useState([])
  const [Downloading, setDownloading] = useState(false)
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
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = allOrders?.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    getOrderHistory(storeId,saasId,id);
    // window.location.reload();
  }, []);
  console.log(allOrders);


  const getDonloadpdf = async (orderId) => {
    setDownloading(true);
    try {
      // First API call
      const response = await DataService.GetDowloaPdf(orderId, saasId, storeId);
      if (response?.data.status) {
        const { invoice } = response.data.data;
        if (invoice) {
          const downloadUrl = `https://annapurnaprdapi.photonsoftwares.com/prod/api/v1/transaction/pdf/${invoice}`;
          console.log("Download URL:", downloadUrl);
  
          // Second API call
          const downloadResponse = await fetch(downloadUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/pdf",
              // Add Authorization header if required
              // "Authorization": `Bearer ${yourAuthToken}`,
            },
          });
  
          if (downloadResponse.ok) {
            // Create a blob and trigger download
            const blob = await downloadResponse.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `Invoice_${orderId}.pdf`; // Set a file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloading(false);
          } else {
            setDownloading(false)
            console.error("Failed to download PDF:", downloadResponse.statusText);
          }
        } else {
          setDownloading(false)
          console.error("Invoice is missing in the response.");
        }
      } else {
        setDownloading(false)
        // Swal.fire({
        //   title: "Waiting...",
        //   text: "May Your Order Bill Not Generated Yet",
        //   icon: "info",
        // })
        console.error("Failed to fetch the invoice:", response?.message);
      }
    } catch (error) {
      setDownloading(false)
      console.error("Error occurred while fetching the PDF:", error);
    }
  };

  const GetOrderDetail = async (storeId, saasId, orderId)=>{
    try {
      const res = await DataService.GetOrderDetail(storeId, saasId, orderId)
      setOrderDetails(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Orders History</h1>
      {allOrders?.length > 0 ? (
        <>
          {" "}
          <div className="w-full flex flex-col gap-6">
            {currentOrders?.map((order, index) => (
              <section
                key={index}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
                onClick={()=>{GetOrderDetail(order.store_id, order.saas_id, order.order_id)}}
              >
                {order?.order_type == "Pickup" && <>
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-6">
                <img
                  src={store_logo}
                  alt="Various food dishes"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{store_name}</h1>
                <p className="text-gray-600 flex items-start sm:items-center sm:flex-row">
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
                <div className="flex flex-col mb-4 mt-2">
                  <div className="text-lg font-medium">
                    Order ID: {order.order_id}
                    <span className="mx-4">{order?.order_type}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Date: {order.order_date}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 flex justify-between items-center">
                    Status:{" "}
                    <span
                      className={`text-sm text-white font-semibold py-[4px] px-[8px] rounded-lg ${
                        order.status === "PENDING" ? "bg-red-400" : "bg-green-400"
                      }`}
                    >
                      {order.status === "delivered"?"DELIVERED":order.status}
                    </span>
                    {/* <div className="text-sm text-gray-600 mt-2">
                      
                     {!Downloading ?  <Button disabled={Downloading} onClick={()=>getDonloadpdf(order?.order_id)} variant="outlined" className="p-0">Download</Button>
                     : <CircularProgress />}
                    </div> */}
                  </div> 
                </div>
                    {/* {orderDetails.length == 0 &&<p onClick={()=>{GetOrderDetail(order.store_id, order.saas_id, order.order_id)}} className="text-sm text-gray-600 mt-2 flex justify-between items-center cursor-pointer">more...</p>} */}
                <div className="flex flex-col">
                  {orderDetails?.map((item, idx) => (
                    item.order_id == order.order_id?
                    <Item
                      key={idx}
                      index={idx + 1}
                      name={item.item_name}
                      price={item.item_price}
                      quantity={item.item_qty}
                    />:""
                  ))}
                </div>
              </section>
            ))}
          </div>
          {allOrders?.length > 3 ? (
            <div className="flex justify-between mt-4 w-full">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="py-2 px-4 bg-gray-200 rounded disabled:opacity-50"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="py-2 px-4 bg-gray-200 rounded disabled:opacity-50"
              >
                <ArrowRight />
              </button>
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        <div className="flex justify-center items-center text-2xl">
          No orders yet{" "}
        </div>
      )}
    </>
  );
};

Orders.propTypes = {
  className: PropTypes.string,
};

export default Orders;
