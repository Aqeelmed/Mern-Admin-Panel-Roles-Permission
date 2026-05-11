import { Navigate, Outlet } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/Login" element={<LoginForm />} />
                
                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/Dashboard" element={<Dashboard />} />
                </Route>
                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/login" />} />
                      {/*end sections Redirect unknown routes */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
