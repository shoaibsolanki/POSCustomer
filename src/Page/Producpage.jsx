import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import DataService from '../services/requestApi'
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from "../Context/CartContext";
const ProductPage = () => {
    const {addItem} = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [data, setData] =  useState({})
  const {Id} = useParams()
  

  const getProduct = async () =>{
    try {
        const res = await DataService.GetproductData(Id)
        setData(res.data.data)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if(Id){
        getProduct()
    }
  }, [Id])
  

//   const data = {
//     storeMaster: {
//       id: 204780,
//       storeName: "KRISHAV MEGAMALL",
//       city: "BHAYAVADAR RAJKOT",
//       state: "Gujarat",
//       country: "India",
//       address: "BHAYAVADAR RAJKOT",
//       storeLogo:
//         "https://posprdapi.photonsoftwares.com/prod/api/v1/store-master/get-store-logo/089ae73b-5cbb-4b8a-9b5e-4acd08d0af0b.jpeg",
//       phoneNo: "9727783530",
//       futterLine1: "Thanks For Shopping with Us",
//     },
//     item_name: "Soya",
//     category: "Vegetables",
//     UOM: "1000",
//     actual_price: 30,
//     price: 60,
//     description: "New Description for soya bine k pate",
//     image_name1:
//       "https://posprdapi.photonsoftwares.com/prod/api/v1/item/get-image-filename/05f24074-c981-4161-8248-1c0b2ac170ad.jpg",
//   };

return (
    <>
        {data && Object.keys(data).length > 0 && (
            <div className="container mx-auto py-4">
                <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
                    <Card
                        sx={{
                            maxWidth: "100%",
                            flex: 1,
                            m: 2,
                            p: 2,
                            borderRadius: "10px",
                            boxShadow: "none",
                        }}
                    >
                        <CardMedia
                            className="h-64 border rounded-2xl"
                            component="img"
                            image={data.image_name1}
                            alt={data.item_name}
                        />
                        <CardContent>
                            <Typography align="start" variant="h6" fontWeight="bold">
                                {data.item_name}
                            </Typography>
                            <Typography align="start" variant="body2" color="text.secondary">
                                {data.category} - {data.UOM}g
                            </Typography>
                            <Typography align="start" variant="h6" color="dark" mt={1}>
                                ₹{data.actual_price}&nbsp;
                                <s style={{ color: "grey", fontSize: "14px" }}>₹{data.price}</s>
                            </Typography>
                            <Typography align="start" variant="body2" color="text.secondary" mt={1}>
                                {data.description}
                            </Typography>
                            <Button onClick={()=>addItem(data)} variant="contained" color="success" fullWidth sx={{ mt: 1 }}>
                                Add to Cart
                            </Button>

                            {/* Conditionally render store details */}
                            {isMobile ? (
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 2 }}
                                    color="dark"
                                    onClick={() => setDrawerOpen(true)}
                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                >
                                    Sold By - Seller Details
                                </Typography>
                            ) : (
                                <Card
                                    sx={{
                                        maxWidth: "100%",
                                        mt: 2,
                                        p: 2,
                                        borderRadius: "10px",
                                        boxShadow: "none",
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        Seller Details
                                    </Typography>
                                    <StoreDetails isMobile={isMobile} data={data.storeMaster} />
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    {/* Store Details in Drawer for Mobile */}
                    <Drawer PaperProps={{ style: { backgroundColor: 'transparent' } }} anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                        <div className="p-4 bg-white rounded-t-lg" style={{ width: "100%" }}>
                            
                            <StoreDetails isMobile={isMobile} setDrawerOpen={setDrawerOpen} data={data.storeMaster} />
                        </div>
                    </Drawer>
                </div>
            </div>
        )}
    </>
);
};

// Store Details Component
const StoreDetails = ({ data ,setDrawerOpen , isMobile}) => {
return (
    <div className="flex flex-col items-center text-center">
       {isMobile && <div  className="flex justify-end w-full">
            <CloseIcon onClick={() => setDrawerOpen(false)} className="text-black"/>
        </div>}
        <img src={data.storeLogo} alt="Store Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-xl font-bold mb-1">{data.storeName}</h1>
        <p className="text-gray-600">
            {data.address}, {data.city}, {data.state}, {data.country}
        </p>
        <p className="text-gray-600">Phone: {data.phoneNo}</p>
        <p className="text-gray-600">{data.futterLine1}</p>
    </div>
);
};

export default ProductPage;
