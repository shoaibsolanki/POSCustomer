import React, { useState } from "react";
// import UserInformation from "./UserInformation";
// import ItemsShowInSide from "./ItemsShowInSide";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import HorizontalLinearAlternativeLabelStepper from "../Componenets/MicroComponenets/HorizontalLinearAlternativeLabelStepper";

const Checkout = () => {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // if (!isAuthenticated) {
  //   return navigate("/login");
  // }
  if (cart?.lenght === 0) {
    return navigate("/");
  } else
    return (
      <div className="my-4  ">
        <HorizontalLinearAlternativeLabelStepper activeStep={1} />
        <div className="flex  justify-center max-md:flex-col-reverse ">
          {/* <UserInformation />
          <ItemsShowInSide items={cart} /> */}
        </div>
      </div>
    );
};

export default Checkout;
