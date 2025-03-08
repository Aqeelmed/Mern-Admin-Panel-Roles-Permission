const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ✅ Ensures email is UNIQUE in MongoDB
    trim: true,
    lowercase: true, // ✅ Always store emails in lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // ✅ Enforce strong passwords
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
