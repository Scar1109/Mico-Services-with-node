// shared/middlewares/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        console.log(process.env.JWT_SECRET); // Debugging line
        console.log("Token: " + token); // Debugging line
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", JSON.stringify(decoded, null, 2));
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Error" + err); // Debugging line
        res.status(400).send('Invalid token.');
    }
};
