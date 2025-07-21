// backend/controllers/user.controller.js

import { User } from '../model/user.model.js';
import jwt from 'jsonwebtoken';

// Function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

/**
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(409).json({ message: 'User with this email or username already exists.' });
        }

        // Create a new user instance (password will be hashed by the pre-save hook)
        const user = new User({ username, email, password });
        await user.save();

        // Generate token and send response
        const token = generateToken(user._id);
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


/**
 * @description Authenticate a user and get token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        console.log(`Attempting login for email: ${email}`); // <-- ADD THIS LINE
        console.log(`Attempting login for email: ${password}`); // <-- ADD THIS LINE
        const user = await User.findOne({ email });

        if (!user) {
            console.log('Login failed: User not found.'); // <-- ADD THIS LINE
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`Password match result: ${isMatch}`); // <-- ADD THIS LINE

        if (!isMatch) {
            console.log('Login failed: Passwords do not match.'); // <-- ADD THIS LINE
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

/**
 * @description Get user profile
 * @route GET /api/auth/profile
 * @access Private (requires token)
 */
export const getUserProfile = async (req, res) => {
    try {
        // The user ID is attached by the verifyToken middleware
        // Find user but exclude the password field from the result
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
};

// NEW: Function to update the username
export const updateUsername = async (req, res) => {
    const { newUsername } = req.body;
    if (!newUsername) {
        return res.status(400).json({ message: 'New username is required.' });
    }

    try {
        // Find a user who has the new username, but is NOT the current user
        const existingUser = await User.findOne({
            username: newUsername.toLowerCase(),
            _id: { $ne: req.userId } // $ne means "not equal"
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username is already taken by another account.' });
        }

        const user = await User.findById(req.userId);
        user.username = newUsername; // Keep the casing the user provides
        await user.save();

        res.status(200).json({
            message: 'Username updated successfully.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("Update Username Error:", error);
        res.status(500).json({ message: 'Server error while updating username.' });
    }
};

// NEW: Function to update the password
export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify the current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // If it matches, set the new password. The pre-save hook in the model will hash it.
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error while updating password.' });
    }
};