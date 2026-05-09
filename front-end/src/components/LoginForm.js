import React, { useState } from "react";
import axios from "axios";
import "../styles.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
// --------------------//
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.trim()) {
      toast.error("Email is required", { position: "top-center", autoClose: 3000 });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format", { position: "top-center", autoClose: 3000 });
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required", { position: "top-center", autoClose: 3000 });
      return false;
    }
    return true;
  };
// ----HANDLE SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setLoading(true);
  
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
  
      if (res.data && res.data.token) {
        toast.success("Login successful! Redirecting...", { position: "top-center", autoClose: 3000 });
  
        localStorage.setItem("token", res.data.token);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      let errorMessage = "Something went wrong! Please try again.";
  
      // Debugging the actual error message
      console.error("Login Error:", err.response?.data || err.message);
  
      if (err.response && err.response.data.error) {
        errorMessage = err.response.data.error;
      }
  
      toast.error(errorMessage, { position: "top-center", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
// Form code started----//
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input-field w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <Link to="/register" className="flex items-center justify-center mt-4">
          <span className="mr-2">Create an Account</span>
          <FaUserPlus className="text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
