const jwt = require("jsonwebtoken");
const { adminSecretKey } = require("../config");

function authenticateAdmin(req, res, next) {
  // Check if the authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized: No authorization header provided" });
  }

  // Split the authorization header and get the token
  const token = req.headers.authorization.split(" ")[1];

  // Verify the token
  jwt.sign(token, adminSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // You may want to perform additional checks here based on decoded information

    // If token is verified, proceed to the next middleware
    next();
  });
}

module.exports = authenticateAdmin;
