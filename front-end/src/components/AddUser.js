import React, { useState } from "react";
import axios from "axios";


const AddUser = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/add", user);
      alert("User added successfully!");
      setUser({ name: "", email: "", phone: "" });
    } catch (error) {
      alert("Error adding user");
    }
  };

  return (
    <div className="p-5 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 border mb-2"
          value={user.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border mb-2"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full p-2 border mb-2"
          value={user.phone}
          onChange={handleChange}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
