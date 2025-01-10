import React, { useState } from "react";
import DataService from "../services/requestApi";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isloading , setIsLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "",
    });
  const [formData, seTFormData] = useState({
    user_name: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    seTFormData({
      ...formData,
      [name]: value,
    });
  };

   const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Validate form data
    if (!formData.user_name || !formData.password) {
        setSnackbar({
            open: true,
            message: "Please fill in all fields",
            severity: "error",
        });
        return;
    }
    setIsLoading(true)
    // Handle login logic here
    try {
        const res = await DataService.Login(formData);
        console.log(res);
        if (res.data.status) {
            const token = res.data.data.jwt_response;
            const user = res.data.data.customer_data;
            if (token && user) {
                login(user, token);
                navigate('/landing');
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
            setSnackbar({
                open: true,
                message: res.data.message || "Login failed",
                severity: "error",
            });
        }
    } catch (error) {
        setIsLoading(false)
        console.log(error);
        setSnackbar({
            open: true,
            message: "An error occurred during login",
            severity: "error",
        });
    }
};

  return (
    <>
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-start block text-sm font-medium text-gray-700"
            >
              User Name
            </label>
            <input
              id="email"
              name="user_name"
              type="text"
              // autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.user_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-start block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
            disabled={isloading}
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
             {isloading?<CircularProgress />:' Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Snackbar
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={handleCloseSnackbar}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    </>
  );
};

export default Login;
