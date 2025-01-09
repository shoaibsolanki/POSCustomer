import React, { useState, useEffect } from "react";
// import AddToCartButton from "./MicroComponenets/AddToCartButton";
import { Link } from "react-router-dom";
// import { useCart } from "../contexts/CartContext";
// import keychain from ".././imgs/keychain.png";
// import ColorShow from "./MicroComponenets/ColorShow";
import { BASEURL } from "../services/http-Pos";
import AddToCartButton from "./AddToCartButton";

const ProductComponent = ({ flex_direction, data }) => {
  const [isHovering, setIsHovering] = useState(false);
  const {bankAccount} = JSON.parse(localStorage.getItem("selectedStore"));
  const [isLoading, setIsLoading] = useState(true); // Add loading state
//   const { cart } = useCart();
  // const Productimage = data?.colorList[0]?.image_url;
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // const selectedProduct = {
  //   ...data,
  //   colorList: [data?.colorList[0]],
  // };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this timeout as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
      className={`border-[1px] p-4 border-gray-400 rounded-xl flex
         ${
        flex_direction === "row"
          ? "flex-row items-center h-full w-full"
          : "flex-col"
      } 
      max-w-[400px] relative animate-pulse`}
    >
      <div className="relative w-full h-[200px] overflow-hidden flex items-center justify-center bg-gray-300 rounded-xl"></div>
      <div className="flex justify-between mt-4 w-full">
        <div className="flex flex-col space-y-2 w-full">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <>
      {/* <div
        className={`border-[1px] p-4 border-gray-400 rounded-xl flex ${
          flex_direction === "row"
            ? "flex-row items-center h-full w-full"
            : "flex-col"
        } max-w-[400px] relative`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full h-[200px] overflow-hidden flex items-center justify-center">
          <Link
            to={`/ProductDetails/${data?.item_id}`}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={data.image_name1}
              alt=""
              width={200}
              height={200}
              className="rounded-xl"
            />
          </Link>
        </div>
        <div className="flex justify-between">
          <div>
            <h2 className="product-title text-primary">
              {data?.item_name?.length > 30
                ? `${data?.item_name?.slice(0, 30)}...`
                : data?.item_name}
            </h2>
            <p className="priceTitle">${data?.price}/-</p>
          </div>
          <AddToCartButton item={data} />
        </div>
      </div> */}
      <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden m-4 inline-block">
                <div className="relative">
                  <img
                   className="w-full h-38 bg-[#D6B6FA] object-cover"
                   style={{
                    height:"9rem"
                   }}
                   src={`${BASEURL.ENDPOINT_URL}item/get-image/${data?.item_id}`} alt={data?.item_name}/>
                  <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 011.414-2.828A4 4 0 017.172 2h.008a4 4 0 012.828 1.172L10 3.414l.992-.992a4 4 0 015.656 5.656L10 17.656l-6.656-6.656a4 4 0 01-.172-5.828z" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                <h2 className="product-title text-primary">
              {data?.item_name?.length > 30
                ? `${data?.item_name?.slice(0, 30)}...`
                : data?.item_name}
            </h2>
                  <div className="flex items-baseline">
                  <p className="priceTitle">{bankAccount} {data?.price}/-</p>
                    {/* <p className="text-sm text-gray-500 line-through ml-2">Rs 399</p> */}
                  </div>
                  {/* <span className="text-green-500 font-semibold text-sm">20% OFF</span> */}
                  {/* <p className="text-gray-700 mt-2 text-wrap">
                    Hyderabadi biryani is a style of biryani originating from Hyderabad, India made with basmati rice and meat.
                  </p> */}
                  <div className="flex items-center mt-2">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927C9.28 2.34 9.97 2.34 10.201 2.927l1.175 3.036a1 1 0 00.95.675h3.24c.707 0 1.002.91.429 1.364l-2.62 2.038a1 1 0 00-.304 1.118l1.175 3.036c.231.587-.476 1.075-.95.675L10 12.347l-2.62 2.038c-.475.4-1.181-.088-.95-.675l1.175-3.036a1 1 0 00-.304-1.118L4.68 7.675c-.573-.454-.278-1.364.429-1.364h3.24a1 1 0 00.95-.675L9.049 2.927z" />
                    </svg>
                    <p className="text-gray-600 font-semibold">5.0 (34) Main Course</p>
                  </div>
                  <AddToCartButton item={data} />
                  {/* <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md">ADD CART</button> */}
                </div>
              </div>
    </>
  );
};

export default ProductComponent;
