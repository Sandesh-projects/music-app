// backend/middleware/user.middleware.js

import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user's ID from the token payload to the request object
        req.userId = decoded.id;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Invalid token:", error.message);
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admin role required.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during role verification.' });
    }
};