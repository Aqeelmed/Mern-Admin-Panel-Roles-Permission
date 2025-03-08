import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserName("User Not Found");
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditRow(user._id);
    setEditedData({ ...user });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${editedData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${errorText}`);
      }

      setUserData((prevData) =>
        prevData.map((user) =>
          user._id === editedData._id ? { ...user, ...editedData } : user
        )
      );

      setEditRow(null);
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error.message);
      toast.error(error.message || "Failed to update user.");
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete user: ${errorText}`);
      }

      setUserData((prevData) => prevData.filter((user) => user._id !== id));

      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      toast.error(error.message || "Failed to delete user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("You are Redirecting to Login Page", {
      position: "top-center",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-64 bg-white dark:bg-gray-800 p-5 shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 hover:text-green-500 transition">
            <h2>Dashboard</h2>
          </h2>
          <ul>
            <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500 cursor-pointer p-2">
              <FiHome /> <span>Home</span>
            </li>

            <li
              className="relative flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500 cursor-pointer p-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FiUser /> <span>Profile</span>
              {showDropdown && (
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 p-3 transition-all transform scale-95 opacity-100 animate-fadeIn">
                  <p className="text-gray-900 dark:text-white font-semibold border-b pb-2">
                    Profile Info
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li
                      onClick={fetchAllUsers}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition duration-200"
                    >
                      👤 View Profile
                    </li>
                    <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition duration-200">
                      ✏️ Edit Profile
                    </li>
                    <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition duration-200">
                      ⚙️ Settings
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-3 bg-red-500 hover:bg-red-600 text-white p-3 rounded-md mt-5"
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <ToastContainer />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to <span>Dashboard</span>
          </h1>

          <div className="relative">
            <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full dark:text-white">
              {userName || "Profile"}
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            {darkMode ? (
              <FiSun className="text-yellow-400" />
            ) : (
              <FiMoon className="text-gray-600" />
            )}
          </button>
        </div>

        {!showTable ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 dark:text-gray-300">
            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md transition duration-300 border border-transparent hover:border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Total Users
              </h3>
              <p className="text-2xl font-semibold text-blue-500">1,204</p>
            </div>
            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md transition duration-300 border border-transparent hover:border-green-500">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Revenue
              </h3>
              <p className="text-2xl font-semibold text-green-500">$50,320</p>
            </div>
            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md transition duration-300 border border-transparent hover:border-red-500">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Orders
              </h3>
              <p className="text-2xl font-semibold text-red-500">3,450</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-6">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-2 dark:text-white">
                    Name
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2 dark:text-white">
                    Email
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 p-2 dark:text-white">
                      {editRow === user._id ? (
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) => handleInputChange(e, "name")}
                          className="p-2 border rounded bg-white dark:bg-gray-800 rounded-lg shadow-md dark:text-white"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2 dark:text-white">
                      {editRow === user._id ? (
                        <input
                          type="email"
                          value={editedData.email}
                          onChange={(e) => handleInputChange(e, "email")}
                          className="p-1 border rounded bg-white dark:bg-gray-800 rounded-lg shadow-md dark:text-white"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      {editRow === user._id ? (
                        <button
                          onClick={handleSaveClick}
                          className="bg-green-500 text-white px-3 py-2 rounded"
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
