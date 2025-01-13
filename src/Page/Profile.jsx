"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderHistory from "../Componenets/MicroComponenets/OrderHistory";
// import Address from "./Address";
// import Account from "./Account";
import { useAuth } from "../Context/AuthContext";
import LogoutModal from "../Componenets/MicroComponenets/LogoutModal";
// import LogoutModal from "./LogoutModal";

const Profile = () => {
  const { logout, authData, isAuthenticated, getOrderHistory } = useAuth();
  const [activeTab, setActiveTab] = useState("order");
  const navigate = useNavigate();
  const { id, saasId, storeId, mobileNumber, name } = authData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // getOrderHistory(storeId,saasId,id);
  },[]);
  let content;
  switch (activeTab) {
    case "account":
      content = ""
    //   <Account />;
      break;
    case "order":
      content = <OrderHistory />;
      break;
    case "address":
      content = "";
    //   <Address />;
      break;
    default:
      content = ""
    //   <OrderHistory />;
      break;
  }

  return (
    <div className="w-full relative bg-white1 flex flex-col items-center justify-start py-20 px-5 box-border gap-[80px] leading-[normal] tracking-[normal] text-left text-35xl text-black font-headline-3 mq750:gap-[20px] mq1125:gap-[40px]">
      <div className="w-[1120px] flex flex-row items-start justify-center max-w-full">
        <h1 className="text-4xl m-0 relative text-inherit tracking-[-1px] leading-[58px] font-medium font-inherit mq450:text-[32px] mq450:leading-[35px] mq1050:text-[43px] mq1050:leading-[46px]">
          My Account
        </h1>
      </div>
      <main className="w-[1120px] flex flex-col md:flex-row md:items-start items-start justify-start gap-[7px] max-w-full text-left text-xl text-black font-hairline-2">
        <div className="w-full md:w-[262px] bg-[#F3F5F7] rounded-lg bg-neutral-02-100 flex flex-col items-start justify-start py-10 px-4 box-border gap-[40px] mq750:hidden mq750:pt-[26px] mq750:pb-[26px] mq750:box-border mq450:gap-[20px]">
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-[66px]">
            <div className="flex-1 flex flex-col items-start justify-start gap-[6px]">
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-[7px]">
                <div className="text-lg relative text-center font-semibold inline-block min-w-[97px] mq450:text-base mq450:leading-[26px]">
                  {name}
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[12px] text-base text-neutral-04-100">
            <div
              onClick={() => {
                setActiveTab("account");
              }}
              className="self-stretch flex flex-row items-start justify-start pt-2 px-0 pb-1.5 text-neutral-07-100 border-b-[1px] border-solid border-neutral-07-100 cursor-pointer"
            >
              <div className="flex-1 relative leading-[26px] font-semibold">
                Account
              </div>
            </div>
            <div
              onClick={() => {
                setActiveTab("address");
              }}
              className="self-stretch flex flex-row items-start justify-start pt-2 px-0 pb-1.5 border-b-[1px] border-solid border-transparent cursor-pointer"
            >
              <div className="flex-1 relative leading-[26px] font-semibold">
                Address
              </div>
            </div>
            <div
              onClick={() => {
                setActiveTab("order");
              }}
              className="self-stretch flex flex-row items-start justify-start pt-2 px-0 pb-1.5 border-b-[1px] border-solid border-transparent cursor-pointer"
            >
              <div className="flex-1 relative leading-[26px] font-semibold">
                Orders
              </div>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start pt-2 px-0 pb-1.5 border-b-[1px] border-solid border-transparent">
              <div className="flex-1 relative leading-[26px] font-semibold">
                <LogoutModal />
              </div>
            </div>
          </div>
        </div>
        <section className="flex flex-col items-start justify-start px-4 box-border gap-4 max-w-full mq750:max-w-full mq450:gap-[20px] mq1050:pl-9 mq1050:pr-9 mq1050:box-border">
          {content}
        </section>
      </main>
    </div>
  );
};

export default Profile;
