const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const SECERT_KEY = process.env.JWT_SECRET; 

const generateToken = (user) => {
    return jwt.sign({ 
        id: user._id, 
    }, SECERT_KEY, {
        expiresIn:'1h'
    });
};

  

module.exports = {
    generateToken,
}