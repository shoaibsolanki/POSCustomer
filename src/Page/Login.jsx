import React, { useState } from "react";
import DataService from "../services/requestApi";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { useCart } from "../Context/CartContext";
import bgimage from "../assets/Bg.png";
const Login = () => {
  const { login } = useAuth();
  const { ClearLocalCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user_name || !formData.password) {
      setSnackbar({ open: true, message: "Please fill in all fields", severity: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await DataService.Login(formData);
      if (res.data.status) {
        const token = res.data.data.jwt_response;
        const user = res.data.data.customer_data;
        if (token && user) {
          login(user, token);
          navigate("/landing");
          ClearLocalCart();
        } else {
          setSnackbar({ open: true, message: "You are not allowed to login", severity: "error" });
        }
      } else {
        setSnackbar({ open: true, message: res.data.message || "Login failed", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "An error occurred during login", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${bgimage})` }} className="flex items-center justify-center min-h-screen bg-cover bg-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200 backdrop-blur-md bg-opacity-30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Sign In</h2>
        <p className="text-center text-sm text-white mb-4">
          Welcome back! Please sign in to continue.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-start text-sm font-semibold text-white">User Name</label>
            <input
              name="user_name"
              type="text"
              placeholder="Enter User Name"
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.user_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-start text-sm font-semibold text-white">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter Your Password"
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 mt-4 text-white bg-primary hover:bg-darkPrimary rounded-lg font-medium flex items-center justify-center"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </button>
        </form>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
