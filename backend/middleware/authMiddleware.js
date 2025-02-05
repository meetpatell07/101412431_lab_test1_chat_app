const jwt = require("jsonwebtoken");

// const authenticate = (req, res, next) => {

//   const authHeader = req.headers.authorization; // Get the Token from Authroization Header
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'Access denied. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract the token

//   try {
//       // Verify the  token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded; // Attach user data to request object
//       next(); // Proceed to the next middleware or route handler

//   } catch (error) {
//       res.status(403).json({ error: 'Invalid or expired token.' });
//   }
// };

// Middleware to protect routes and get user info from token
const protect = (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" }); // Token not found
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret key
    req.user = decoded; // Attach the decoded user data to the request object (including user _id)
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token" }); // Handle invalid token
  }

};

module.exports = { protect };
