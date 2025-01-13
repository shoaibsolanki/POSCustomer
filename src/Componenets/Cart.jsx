import React, { Suspense, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Remove, Delete, CurrencyRupee } from "@mui/icons-material";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { BASEURL } from "../services/http-Pos";
// import emptyCart from ".././imgs/shopping.png";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import HorizontalLinearAlternativeLabelStepper from "../Componenets/MicroComponenets/HorizontalLinearAlternativeLabelStepper";

const CartItem = ({
  item,
  deleteItem,
  editItem,
  isAuthenticated,
  bankAccount
}) => (
  <>
    <Box className="my-2 items-center max-md:hidden">
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={2}>
          <img
              src={`${BASEURL.ENDPOINT_URL}item/get-image/${item.item_id}`}
            alt={item?.itemName}
            width={50}
            height={50}
            style={{ width: "50%", borderRadius: "10px" }}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            {isAuthenticated ? item?.itemName?.slice(0, 30) : item.item_name}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography className="fw-bold" variant="body1">
            {bankAccount} {item.price}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => editItem(item.product_qty -1, item.id)}>
              <Remove />
            </IconButton>
            <Typography variant="body1">{item.product_qty}</Typography>
            <IconButton onClick={() => editItem(item.product_qty +1, item.id)}>
              <Add />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Typography className="fw-bold" variant="body1">
            {bankAccount}{item.price * item.product_qty}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => deleteItem(item.id)}>
            <Delete onClick={() => deleteItem(item.id)} />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
    </Box>
    {/* Mobail View: */}
    <div className="md:hidden flex flex-col p-2 gap-2">
    <div
      className={`flex flex-col items-start justify-start w-full gap-2`}
    >
      <section className="w-full bg-white rounded-lg p-2 shadow-md">
        <div className="flex items-center justify-between w-full">
          {/* Image */}
          <img
            width={50}
            height={50}
            src={`${BASEURL.ENDPOINT_URL}item/get-image/${item.item_id}`}
            className="w-[50px] h-[50px] rounded-lg object-cover"
            alt={item?.itemName}
          />

          {/* Item Name and Delete Button */}
          <div className="flex-1 flex flex-col ml-2">
            <b className="text-sm leading-tight">
              {isAuthenticated
                ? item?.itemName?.slice(0, 25) + (item?.itemName?.length > 25 ? '...' : '')
                : item.item_name?.slice(0, 25) + (item.item_name?.length > 25 ? '...' : '')}
            </b>
            <div className="text-xs text-gray-600">
              {bankAccount} {item.price}
            </div>
          </div>
          
          <IconButton size="small" onClick={() => deleteItem(item.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </div>

        {/* Quantity and Total Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <IconButton size="small"  onClick={() => editItem(item.product_qty -1, item.id)}>
              <Remove fontSize="small" />
            </IconButton>
            <Typography variant="body2">{item.product_qty}</Typography>
            <IconButton size="small"  onClick={() => editItem(item.product_qty +1, item.id)}>
              <Add fontSize="small" />
            </IconButton>
          </div>
          <div>
            <Typography className="text-sm font-bold">
             {bankAccount} {item.price * item.product_qty}
            </Typography>
          </div>
        </div>
      </section>
    </div>
  </div>
  </>
);

const Cart = () => {
  const {
    clearCart,
    deleteItem,
    cart,
    editItem
  } = useCart();
  const totalPrice = cart?.reduce((total, product) => {
    return total + product.price * product.product_qty;
  }, 0)
  const { authData, isAuthenticated } = useAuth();
  const { id, saasId, storeId } = authData;
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const {bankAccount} = JSON.parse(localStorage.getItem("selectedStore"));
  useEffect(() => {
    if (authData && authData.id) {
      setUserId(authData.id);
    }
  }, [authData]);

  useEffect(() => {
    if (cart?.length > 0) {
      setLoading(false);
    }
  }, [cart]);
  useEffect(() => {
    if (cart?.length === 0) {
      setLoading(false);
    }
  }, [cart]);

  const handleProceedToCheckout = () => {
    navigate("/checkout");
    // if (userId) {
    // } else {
    //   navigate("/login");
    // }
  };

  if (loading) {
    return (
      <div className="my-4">
        <HorizontalLinearAlternativeLabelStepper activeStep={0} />
        <Box className="mt-5" p={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <div className="mb-4 hidden max-md:block text-primary font-semibold">
                {loading ? (
                  <Skeleton variant="text" width={100} height={40} />
                ) : (
                  <>
                    subtotal{" "}
                    <span className="text-xl font-bold">
                      <CurrencyRupee fontSize="small" />
                      {totalPrice}
                    </span>
                  </>
                )}
              </div>
              <div className="max-md:hidden">
                <Box bgcolor="#E6F7FF" p={2} borderRadius={2}>
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {loading ? <Skeleton width={80} /> : "Product"}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {loading ? <Skeleton width={50} /> : "Price"}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {loading ? <Skeleton width={70} /> : "Quantity"}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {loading ? <Skeleton width={70} /> : "Subtotal"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </div>
              {loading
                ? [1, 2, 3].map((_, index) => <CartItemSkeleton key={index} />)
                : cart.map((item, index) => (
                    <Suspense fallback={<CartItemSkeleton />} key={index}>
                      <CartItem
                        item={item}
                        isAuthenticated={isAuthenticated}
                        deleteItem={deleteItem}
                        editItem={editItem}
                        bankAccount={bankAccount}
                      />
                    </Suspense>
                  ))}
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "center", sm: "flex-start" }}
                mt={2}
              >
                <button className="bg-second text-white font-medium text-md rounded-2xl p-4 w-full sm:w-[200px] text-center mb-2 sm:mb-0">
                  <Link to="/">Continue shopping</Link>
                </button>
                <button
                  className="btn btn-outline-info rounded-2xl w-full sm:w-[150px]"
                  style={{
                    background: "none",
                    color: "#C33131",
                    borderColor: "red",
                  }}
                  variant="contained"
                  onClick={clearCart}
                >
                  Clear cart
                </button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box p={2} className="flex justify-center" bgcolor="#E6F7FF">
                <Typography variant="subtitle1" fontWeight="bold">
                  {loading ? <Skeleton width={100} /> : "Cart total"}
                </Typography>
              </Box>
              <Box p={2} borderRadius={2}>
                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography variant="body1">
                    {loading ? <Skeleton width={70} /> : "Subtotal"}
                  </Typography>
                  <Typography variant="body1">
                    {loading ? <Skeleton width={50} /> : `$${totalPrice}`}
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <TextField
                    label="Enter coupon code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{ endAdornment: <Button>Apply</Button> }}
                  />
                )}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <Select fullWidth displayEmpty defaultValue="India">
                    <MenuItem value="">India</MenuItem>
                    <MenuItem value="">USA</MenuItem>
                    <MenuItem value="">India</MenuItem>
                  </Select>
                )}
                <Box display="flex" justifyContent="space-between" my={2}>
                  <Typography variant="body1">
                    {loading ? <Skeleton width={90} /> : "Total amount"}
                  </Typography>
                  <Typography variant="body1">
                    {loading ? <Skeleton width={50} /> : `$${totalPrice}`}
                  </Typography>
                </Box>
                <div className="flex justify-center">
                  {loading ? (
                    <Skeleton variant="rectangular" height={40} width={250} />
                  ) : (
                    <button
                      onClick={handleProceedToCheckout}
                      className="bg-second text-white font-medium text-md rounded-2xl p-2 w-full sm:w-[250px] text-center"
                    >
                      Proceed to checkout
                    </button>
                  )}
                </div>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }

  if (cart?.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 flex-col text-center">
        {/* <img height={200} width={200} alt="empty_cart" src={emptyCart} /> */}
        <h2 className="text-4xl font-semibold text-primary">
          Your cart is empty
        </h2>
        <p className="text-2xl text-black text-medium">
          Looks like you have not added anything to your cart
        </p>
        <Link to="/" className="btn font-bold bg-primary my-4 px-16 text-white">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="my-4">
      <HorizontalLinearAlternativeLabelStepper activeStep={0} />
      <Box className="mt-5" p={5}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <div className="mb-4 hidden max-md:block text-primary font-semibold">
              subtotal{" "}
              <span className="text-xl font-bold">
                <CurrencyRupee fontSize="small" />
                {totalPrice}
              </span>
            </div>
            <div className="max-md:hidden">
              <Box bgcolor="#E6F7FF" p={2} borderRadius={2}>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Product
                    </Typography>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Price
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Quantity
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Subtotal
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </div>
            {cart?.map((item, index) => {
              return (
                <CartItem
                  key={index}
                  item={item}
                  isAuthenticated={isAuthenticated}
                  deleteItem={deleteItem}
                  editItem={editItem}
                />
              );
            })}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "center", sm: "flex-start" }}
              mt={2}
            >
              <button className="bg-second text-white font-medium text-md rounded-2xl p-4 w-full sm:w-[200px] text-center mb-2 sm:mb-0">
                <Link to="/">Continue shopping</Link>
              </button>
              <button
                className="btn btn-outline-info rounded-2xl w-full sm:w-[150px]"
                style={{
                  background: "none",
                  color: "#C33131",
                  borderColor: "red",
                }}
                variant="contained"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} className="flex justify-center" bgcolor="#E6F7FF">
              <Typography variant="subtitle1" fontWeight="bold">
                Cart total
              </Typography>
            </Box>
            <Box p={2} borderRadius={2}>
              <Box display="flex" justifyContent="space-between" my={1}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">{bankAccount} {totalPrice}</Typography>
              </Box>
              <TextField
                label="Enter coupon code"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{ endAdornment: <Button>Apply</Button> }}
              />
              {/* <Select fullWidth displayEmpty defaultValue="">
                <MenuItem value="">India</MenuItem>
              </Select> */}
              <Box display="flex" justifyContent="space-between" my={2}>
                <Typography variant="body1">Total amount</Typography>
                <Typography variant="body1">{bankAccount} {totalPrice}</Typography>
              </Box>
              <div className="flex justify-center">
                <button
                  onClick={handleProceedToCheckout}
                  className="bg-second text-white font-medium text-md rounded-2xl p-2 w-full sm:w-[250px] text-center"
                >
                  Proceed to checkout
                </button>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Cart;
const CartItemSkeleton = () => {
  return (
    <Box className="my-2 items-center max-md:hidden">
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={2}>
          <Skeleton variant="rectangular" width={50} height={50} />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            <Skeleton width={100} />
          </Typography>
          <Typography variant="body2">
            <Skeleton width={80} />
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography className="fw-bold" variant="body1">
            <Skeleton width={50} />
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Typography variant="body1">
              <Skeleton width={20} />
            </Typography>
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Typography className="fw-bold" variant="body1">
            <Skeleton width={50} />
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Skeleton variant="circular" width={40} height={40} />
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
};
