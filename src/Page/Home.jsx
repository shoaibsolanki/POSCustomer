import React from 'react';
import HeroSection from '../Componenets/HeroSection';

const Home = () => {
    return (
        <main className=" min-h-screen ">
      <div className="  max-w-[1800px] mx-auto px-4 my-2">
        <HeroSection />
        {/* <HorizontalCategoryList/>
        <PopularProducts /> */}
        {/* <SaleComponenet /> */}
        {/* <ImageSwitchProduct /> */}
        {/* <WhyUs /> */}
      </div>
        
    </main>
    );
};

export default Home;