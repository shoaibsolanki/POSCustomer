import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { BASEURL } from "../services/http-Pos";
import axios from "axios";
const HeroSection = ({ data }) => {
//   const [isLoading, setIsLoading] = useState(true);
 
//   const handleImageLoad = () => {
//     setIsLoading(false);
//   };
  const selectedStore = localStorage.getItem('selectedStore');
  const parsedStore = selectedStore ? JSON.parse(selectedStore) : null;
  const { saasId} = parsedStore || {};

const [images, setImages] = useState([]);

useEffect(() => {
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${BASEURL.ENDPOINT_URL}saas-master/get-brandlogos/${saasId}`);
      setImages(Object.values(response.data));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  if (saasId) {
    fetchImages();
  }
}, [saasId]);

console.log(images)

  return (<>
<Swiper
  modules={[Autoplay]}
  autoplay={{ delay: 1000, disableOnInteraction: false }}
  loop={true}
  spaceBetween={10}
  slidesPerView={1}
>
  {images.map((src, index) => (
    <SwiperSlide key={index}>
      <img 
        src={src} 
        alt={`Slide ${index + 1}`} 
        style={{ 
          width: "100%", 
          height: "300px", 
          objectFit: "contain" // Prevents stretching
        }} 
      />
    </SwiperSlide>
  ))}
</Swiper>
    {/* { storeLogo &&<div  className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-6">
    <img
      src={storeLogo}
      alt="Store Logo"
      className="w-full h-full object-cover"
      />
    </div>} */}
    </>
  );
};

export default HeroSection;

const ImageSkeleton = () => (
  <div className="w-full h-[300px] bg-gray-300 animate-pulse rounded-xl"></div>
);
