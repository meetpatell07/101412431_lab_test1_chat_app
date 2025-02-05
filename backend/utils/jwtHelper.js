const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const SECERT_KEY = process.env.JWT_SECRET; 

const generateToken = (user) => {
    return jwt.sign({ 
        id: user._id, 
        email: user.email,
        role: user.role     
    }, SECERT_KEY, {
        expiresIn:'1h'
    });
};

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
  
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized, no token provided" });
//     }
  
//     const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  
//     try {
//       // Verify and decode token
//       const decoded = jwt.verify(token, SECERT_KEY);
//       req.user = { id: decoded.id }; // Attach userId to req.user
//       next(); // Proceed to the next middleware/controller
//     } catch (error) {
//       console.error("Token verification failed:", error.message);
//       res.status(401).json({ message: "Unauthorized, invalid token" });
//     }
//   };
  

module.exports = {
    generateToken,
    verifyToken
}