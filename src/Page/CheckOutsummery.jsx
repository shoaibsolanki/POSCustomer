import { Button } from "@mui/material";
import Placeholder from "../Componenets/MicroComponenets/Placeholder";
import PropTypes from "prop-types";
// import keychain from ".././imgs/keychain.png";
// import Lanyard from ".././imgs/lanyard.png";

import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import HorizontalLinearAlternativeLabelStepper from "../Componenets/MicroComponenets/HorizontalLinearAlternativeLabelStepper";
import { BASEURL } from "../services/http-Pos";

const OrderComplete = ({ className = "" }) => {
  const [orderInformations, setOrderInformations] = useState(null);
  const [orderSummery, setOrderSummery] = useState(null);
  useEffect(() => {
    const savedOrderInformations = localStorage.getItem("orderInformations");
    if (savedOrderInformations) {
      setOrderInformations(JSON.parse(savedOrderInformations));
    }
  }, []);
  useEffect(() => {
    const savedSummery = localStorage.getItem("orderMaster");
    if (savedSummery) {
      setOrderSummery(JSON.parse(savedSummery));
    }
  }, []);
  console.log("order_informations", orderInformations?.slice(0, 3));
  const orderLength = orderInformations?.length - 3;
  console.log("orderlength", orderLength);

  const { isPaymentSuccessful } = useAuth();

  const navigate = useNavigate();
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (!isPaymentSuccessful) {
    navigate("/cart");
  } else
    return (
      <div className="my-4">
        <HorizontalLinearAlternativeLabelStepper activeStep={3} />
        <div
          className={`w-full shadow-[0px_32px_48px_-48px_rgba(18,_18,_18,_0.1)] rounded-lg bg-white flex flex-col items-center justify-start py-20 px-5 box-border gap-[40px] leading-[normal] tracking-[normal] mq600:gap-[20px] ${className} border-2 my-8 rounded-xl max-w-[700px] mx-auto`}
        >
          <section className="w-[548px] flex flex-row items-start justify-start py-0 px-7 box-border max-w-full text-center text-9xl text-neutral-04-100 font-headline-4">
            <div className="flex-1 flex flex-col items-start justify-start gap-[16px] max-w-full">
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-[22px] box-border max-w-full">
                <h1 className="m-0 flex-1 relative text-3xl tracking-[-0.6px] leading-[34px] font-medium font-inherit inline-block max-w-full mq450:text-[22px] mq450:leading-[27px]">
                  Thank you! 🎉
                </h1>
              </div>
              <h1 className="m-0 self-stretch relative text-4xl tracking-[-0.4px] leading-[44px] font-medium font-inherit text-neutrals-2 text-black">
                Your order has been received
              </h1>
            </div>
          </section>
          <section className="w-[548px] flex flex-row items-start justify-start py-0 px-px box-border max-w-full">
            <div className="flex-1 flex flex-row items-start justify-center py-0 px-[89px] box-border max-w-full gap-[20px] mq450:pl-5 mq450:pr-5 mq450:box-border mq600:flex-wrap mq600:pl-11 mq600:pr-11 mq600:box-border max-sm:flex-col max-sm:items-center w-full  ">
              {orderInformations?.slice(0, 3).map((item, index) => {
                return (
                  <Placeholder
                    key={index}
                    image={`${BASEURL.ENDPOINT_URL}item/get-image/${item.item_id}`}
                    semicolons={item.product_qty}
                  />
                );
              })}
              {orderLength > 0 ? (
                <h1 className="text-lg text-dark h-14 w-14 p-2 bg-gray-100 rounded-badge flex items-center justify-center ml-5 font-semibold">
                  +{orderLength}
                </h1>
              ) : (
                ""
              )}
            </div>
          </section>
          <section className="flex flex-row items-center justify-center py-0 px-[139px] box-border gap-[32px] max-w-full text-left text-sm text-neutral-04-100 font-caption-1-semi mq450:pl-5 mq450:pr-5 mq450:box-border mq600:flex-wrap mq600:gap-[16px] mq600:pl-[69px] mq600:pr-[69px] mq600:box-border">
            <div className="flex flex-col items-start justify-start gap-[20px] min-w-[120px] mq600:flex-1">
              <div className="flex flex-row items-center justify-center">
                {/* <div className="relative leading-[22px] font-semibold inline-block min-w-[81px]">
                  Order code:
                </div> */}
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="relative text-black leading-[22px] font-semibold inline-block min-w-[36px]">
                  Date:
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="relative text-black leading-[22px] font-semibold inline-block min-w-[38px]">
                  Total:
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="relative text-black leading-[22px] font-semibold inline-block min-w-[120px]">
                  Payment method:
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[20px] min-w-[120px] text-neutral-07-100 mq600:flex-1">
              {/* <div className="relative leading-[22px] font-semibold inline-block min-w-[93px] text-black">
                #0123_45678
              </div> */}
              <div className="relative leading-[22px] font-semibold inline-block min-w-[118px] text-black">
                {formattedDate}
              </div>
              <div className="relative leading-[22px] font-semibold inline-block min-w-[69px] text-black">
                 {orderSummery?.data?.orderValue}
              </div>
              <div className="relative leading-[22px] font-semibold inline-block min-w-[78px] text-black">
                Online Payment{" "}
              </div>
            </div>
          </section>
          <div className="w-[548px] flex flex-row items-start justify-center max-w-full">
            <a href="/profile">
              <Button
                className="h-[52px] w-[203px]"
                disableElevation
                variant="contained"
                sx={{
                  textTransform: "none",
                  color: "#fff",
                  fontSize: "16",
                  background: "#eda315",
                  borderRadius: "80px",
                  "&:hover": { background: "#eda315" },
                  width: 203,
                  height: 52,
                }}
              >
                Purchase history
              </Button>
            </a>
          </div>
        </div>{" "}
      </div>
    );
};

OrderComplete.propTypes = {
  className: PropTypes.string,
};

export default OrderComplete;
