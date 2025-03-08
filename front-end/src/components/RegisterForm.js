
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required", { position: "top-center", autoClose: 3000 });
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format", { position: "top-center", autoClose: 3000 });
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters", { position: "top-center", autoClose: 3000 });
      setLoading(false);
      return;
    }
  
    try {
      await axios.post("http://localhost:5000/register", formData); // Removed `response`
  
      toast.success("Registration Successful! Redirecting to Login...", {
        position: "top-center",
        autoClose: 3000
      });
  
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error, { position: "top-center", autoClose: 3000 });
      } else {
        toast.error("Registration Failed. Please try again.", { position: "top-center", autoClose: 3000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
         <Link to="/login" className="flex items-center justify-center mt-4">
          <span className="mr-2"> Redirect to Login </span>
         <FaUserPlus className="text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;