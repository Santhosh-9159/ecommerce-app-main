// controllers/AdminController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Product = require("../models/product");

const AdminController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        "Admin@123"
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async register(req, res) {
    try {
      const { email, password } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new admin
      const newAdmin = new Admin({ email, password: hashedPassword });
      await newAdmin.save();

      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      console.error("Error registering admin:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  
};

module.exports = AdminController;
