// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminRoutes = require("./routes/adminRoutes");
// Express app setup
const app = express();
const port = 8000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://santhoshgunaseelan8:ecomerce@e-comerce.ib3k2tq.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database error", err);
  });

// Models
const User = require("./models/user");
const Order = require("./models/order");
const Admin = require("./models/admin");
const Product = require("./models/product");

// Routes
const authenticateAdmin = require("./middleware/admin-auth");
app.use("/admin", adminRoutes);

// Function to send verification email
const sendVerificationEmail = async (email, verificationToken) => {
  // Nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "santhoshgunaseelan8@gmail.com",
      pass: "bqpj zdgf lcfh rsyj",
    },
  });

  // Email message configuration
  const mailOptions = {
    from: "onlineshopping.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://192.168.0.230:8000/verify/${verificationToken}`,
  };

  // Sending the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Register a new user endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to the database
    await newUser.save();

    console.log("New User Registered:", newUser);

    // Send verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.log("Error during registration:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});
// Email verification endpoint
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    // Find the user with the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    // Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verification Failed" });
  }
});

// Secret key generation
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
const secretKey = generateSecretKey();

// Regular user login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

// Endpoint to store a new address
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Find the user by the UserId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new address to the user's addresses array
    user.addresses.push(address);

    // Save the updated user in the backend
    await user.save();

    res.status(200).json({ message: "Address created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
});

// Endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the addresses" });
  }
});

// Endpoint to store all the orders
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      status: "Processing",
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("Error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});

// Get user profile endpoint
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

// Get orders by user ID endpoint

app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId }).populate("user");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error " });
  }
});

// Retrieve admin dashboard data endpoint
app.get("/admin/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    res.status(200).json({ totalUsers, totalOrders, totalRevenue });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ message: "Error fetching admin dashboard data" });
  }
});

// Admin User Management Endpoints

// Get all users (admin only)
app.get("/admin/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user by ID (admin only)
app.get("/admin/users/:userId", authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete user by ID (admin only)
app.delete("/admin/users/:userId", authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find and delete orders associated with the user
    await Order.deleteMany({ user: userId });

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User and associated orders deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to get user details and orders
app.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch orders associated with the user
    const orders = await Order.find({ user: userId });

    // Combine user details and orders into a single object
    const userData = {
      name: user.name,
      email: user.email,
      orders: orders // Array of orders associated with the user
    };

    // Send the combined data back to the frontend
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user details and orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Delete order by ID endpoint
app.delete("/orders/:orderId", authenticateAdmin, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by its ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a product by ID
app.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new product
app.post('/products', async (req, res) => {
  const { title, description, price, rating, imageUrl, carouselImages } = req.body;
  try {
    const newProduct = new Product({
      title,
      description,
      price,
      rating,
      imageUrl,
      carouselImages,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a product
app.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const updateFields = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product
app.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Server listening
app.listen(port, () => {
  console.log("Server connected");
});
