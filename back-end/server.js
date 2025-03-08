const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());


// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mern-auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", userSchema);

// fetching single Admin user data api
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(token)
    const decoded = jwt.verify(token, "hh");
    const user = await User.findById(decoded.userId).select("name");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ name: user.name });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid user ID" });
      }

      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



//fetching all data from db
// Route to fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from database
    res.json(users); // Send users as JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }

});
// Update User API
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// res.json([
  //   { id: 1, name: "John Doe", email: "john@example.com" },
  //   { id: 2, name: "Jane Doe", email: "jane@example.com" },
  // ]);

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});




//login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, "hh", { expiresIn: "1h" });
   
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));